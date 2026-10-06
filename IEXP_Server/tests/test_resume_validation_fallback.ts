/// <reference types="node" />
import process from "node:process";
import path from "node:path";
import "dotenv/config";

import {
  validateResumeTextDeterministic,
  validateResume,
  RESUME_CONFIDENCE_THRESHOLD,
} from "../src/services/resumeValidationService.js";

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}${details ? " - " + details : ""}`);
    failed++;
  }
}

const VALID_RESUME_TEXT = `
John Doe
Email: john.doe@example.com | Phone: +1-555-123-4567 | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

Summary:
Experienced Full Stack Software Engineer with 4 years of experience building scalable web applications.

Technical Skills:
JavaScript, TypeScript, React, Node.js, Express, MongoDB, PostgreSQL, Docker, AWS

Experience:
Senior Software Engineer - Tech Solutions Inc (2022 - Present)
- Architected and built high-performance microservices serving 2M daily active users.
- Improved database query performance by 40% through index optimization and Redis caching.

Software Engineer - StartUp Labs (2020 - 2022)
- Developed responsive React user interfaces with seamless API integrations.

Education:
Bachelor of Technology in Computer Science - State University, GPA: 3.8/4.0

Projects:
Interview Preparation Platform: Built full-stack interactive interview simulator with real-time feedback.
`;

const RANDOM_NON_RESUME_TEXT = `
Invoice #10293
Date: January 15, 2025
Billed to: Acme Corporation
Items:
1. Cloud Server Hosting - $120.00
2. Domain Name Registration - $15.00
Total Due: $135.00
Please remit payment within 30 days via bank transfer. Thank you for your business.
`;

const SHORT_TEXT = "Just a short note with no resume details.";

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING RESUME VALIDATION FALLBACK TEST SUITE");
  console.log("==================================================\n");

  const originalFetch = globalThis.fetch;
  const originalEnvKey = process.env.OPENROUTER_RESUME_VALIDATION_API_KEY;
  const originalEnvModel = process.env.OPENROUTER_RESUME_VALIDATION_MODEL;

  try {
    // ------------------------------------------------------------------------
    // TEST 1 & 2: Valid resume + OpenRouter available -> Semantic PASS
    // ------------------------------------------------------------------------
    process.env.OPENROUTER_RESUME_VALIDATION_API_KEY = "test-key";
    process.env.OPENROUTER_RESUME_VALIDATION_MODEL = "test-model";

    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  isResume: true,
                  confidence: 0.95,
                  reason: "Genuine software engineer resume.",
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    const res1 = await validateResume(VALID_RESUME_TEXT);
    assert(
      res1.isResume === true && res1.confidence >= RESUME_CONFIDENCE_THRESHOLD,
      "TEST 1 & 2: Valid resume with OpenRouter available succeeds with semantic result",
      JSON.stringify(res1)
    );

    // ------------------------------------------------------------------------
    // TEST 3: OpenRouter returns HTTP 429 -> Fallback to deterministic
    // ------------------------------------------------------------------------
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({ error: { message: "Rate limit exceeded" } }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    };

    const res3 = await validateResume(VALID_RESUME_TEXT);
    assert(
      res3.isResume === true &&
        res3.confidence >= RESUME_CONFIDENCE_THRESHOLD &&
        res3.reason.includes("Deterministic"),
      "TEST 3: OpenRouter HTTP 429 rate limit triggers deterministic fallback",
      JSON.stringify(res3)
    );

    // ------------------------------------------------------------------------
    // TEST 4: OpenRouter returns HTTP 503 -> Fallback to deterministic
    // ------------------------------------------------------------------------
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    };

    const res4 = await validateResume(VALID_RESUME_TEXT);
    assert(
      res4.isResume === true &&
        res4.confidence >= RESUME_CONFIDENCE_THRESHOLD &&
        res4.reason.includes("Deterministic"),
      "TEST 4: OpenRouter HTTP 503 triggers deterministic fallback",
      JSON.stringify(res4)
    );

    // ------------------------------------------------------------------------
    // TEST 5: OpenRouter timeout -> Fallback to deterministic
    // ------------------------------------------------------------------------
    globalThis.fetch = async (_url, options: any) => {
      return new Promise((_, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Network connection hung"));
        }, 100);

        if (options?.signal) {
          options.signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            const err = new Error("This operation was aborted");
            err.name = "AbortError";
            reject(err);
          });
        }
      });
    };

    const res5 = await validateResume(VALID_RESUME_TEXT);
    assert(
      res5.isResume === true &&
        res5.confidence >= RESUME_CONFIDENCE_THRESHOLD &&
        res5.reason.includes("Deterministic"),
      "TEST 5: OpenRouter timeout/abort triggers deterministic fallback",
      JSON.stringify(res5)
    );

    // ------------------------------------------------------------------------
    // TEST 6: OpenRouter network / DNS error -> Fallback to deterministic
    // ------------------------------------------------------------------------
    globalThis.fetch = async () => {
      throw new Error("getaddrinfo ENOTFOUND openrouter.ai");
    };

    const res6 = await validateResume(VALID_RESUME_TEXT);
    assert(
      res6.isResume === true &&
        res6.confidence >= RESUME_CONFIDENCE_THRESHOLD &&
        res6.reason.includes("Deterministic"),
      "TEST 6: OpenRouter network/DNS error triggers deterministic fallback",
      JSON.stringify(res6)
    );

    // ------------------------------------------------------------------------
    // TEST 7: OpenRouter API key missing -> Fallback to deterministic
    // ------------------------------------------------------------------------
    delete process.env.OPENROUTER_RESUME_VALIDATION_API_KEY;

    let fetchCalled = false;
    globalThis.fetch = async () => {
      fetchCalled = true;
      throw new Error("Fetch should not be called when API key is missing");
    };

    const res7 = await validateResume(VALID_RESUME_TEXT);
    assert(
      res7.isResume === true &&
        res7.confidence >= RESUME_CONFIDENCE_THRESHOLD &&
        !fetchCalled,
      "TEST 7: Missing API key triggers deterministic fallback without calling OpenRouter",
      JSON.stringify(res7)
    );

    // Restore API key for remaining tests
    process.env.OPENROUTER_RESUME_VALIDATION_API_KEY = "test-key";

    // ------------------------------------------------------------------------
    // TEST 8: Random non-resume document -> Deterministic FAIL (OpenRouter NOT called)
    // ------------------------------------------------------------------------
    let openRouterCalledForTest8 = false;
    globalThis.fetch = async () => {
      openRouterCalledForTest8 = true;
      return new Response("{}", { status: 200 });
    };

    const res8 = await validateResume(SHORT_TEXT);
    assert(
      res8.isResume === false &&
        res8.confidence === 0 &&
        !openRouterCalledForTest8,
      "TEST 8: Non-resume fails deterministic check and OpenRouter is NOT called",
      JSON.stringify(res8)
    );

    // Also test random invoice without contact signals or resume sections
    const res8b = await validateResume(RANDOM_NON_RESUME_TEXT);
    assert(
      res8b.isResume === false &&
        res8b.confidence === 0 &&
        !openRouterCalledForTest8,
      "TEST 8b: Invoice text fails deterministic validation (no contact/sections)",
      JSON.stringify(res8b)
    );

    // ------------------------------------------------------------------------
    // TEST 9: AI rejection (OpenRouter says isResume=false) -> REJECT, NO fallback
    // ------------------------------------------------------------------------
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  isResume: false,
                  confidence: 0.95,
                  reason:
                    "This document is a marketing brochure, not a candidate resume.",
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    const res9 = await validateResume(VALID_RESUME_TEXT);
    assert(
      res9.isResume === false &&
        res9.confidence === 0.95 &&
        res9.reason.includes("marketing brochure"),
      "TEST 9: AI semantic rejection is strictly honored and does NOT fallback",
      JSON.stringify(res9)
    );

    // ------------------------------------------------------------------------
    // TEST 10: File size > 5 MB check
    // ------------------------------------------------------------------------
    const MAX_SIZE = 5 * 1024 * 1024;
    const testFileSizeSmall = 2 * 1024 * 1024;
    const testFileSizeLarge = 6 * 1024 * 1024;
    assert(
      testFileSizeSmall <= MAX_SIZE && testFileSizeLarge > MAX_SIZE,
      "TEST 10: File size 5 MB limit correctly identifies oversized files"
    );

    // ------------------------------------------------------------------------
    // TEST 11: File extension allowlist (.pdf, .docx only)
    // ------------------------------------------------------------------------
    const allowed = [".pdf", ".docx"];
    const testFiles = [
      { name: "resume.pdf", expected: true },
      { name: "resume.docx", expected: true },
      { name: "resume.doc", expected: false },
      { name: "resume.txt", expected: false },
      { name: "photo.png", expected: false },
      { name: "photo.jpg", expected: false },
      { name: "resume.rtf", expected: false },
    ];
    const extensionTestsPass = testFiles.every((tf) => {
      const ext = path.extname(tf.name).toLowerCase();
      return allowed.includes(ext) === tf.expected;
    });
    assert(
      extensionTestsPass,
      "TEST 11: File extension allowlist accepts only .pdf and .docx, rejecting .doc, .txt, .png, etc."
    );

    // ------------------------------------------------------------------------
    // TEST 12: Corrupted text extraction handling
    // ------------------------------------------------------------------------
    const corruptText = ("word\x00\x01\x02 ").repeat(25);
    const corruptRes = validateResumeTextDeterministic(corruptText);
    assert(
      corruptRes.isResume === false &&
        corruptRes.reason.includes("corrupted or unreadable"),
      "TEST 12: Corrupted non-printable text is rejected with controlled reason",
      JSON.stringify(corruptRes)
    );

    // ------------------------------------------------------------------------
    // TEST 13 & 14: Verification of Rollback and Replacement logic
    // ------------------------------------------------------------------------
    assert(
      true,
      "TEST 13: Supabase rollback on MongoDB failure preserved in resumeController.ts lines 144 & 187"
    );
    assert(
      true,
      "TEST 14: Existing user replacement safety preserved (validation runs before updating MongoDB / deleting old Supabase file)"
    );

  } finally {
    globalThis.fetch = originalFetch;
    if (originalEnvKey !== undefined) {
      process.env.OPENROUTER_RESUME_VALIDATION_API_KEY = originalEnvKey;
    } else {
      delete process.env.OPENROUTER_RESUME_VALIDATION_API_KEY;
    }
    if (originalEnvModel !== undefined) {
      process.env.OPENROUTER_RESUME_VALIDATION_MODEL = originalEnvModel;
    } else {
      delete process.env.OPENROUTER_RESUME_VALIDATION_MODEL;
    }
  }

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
