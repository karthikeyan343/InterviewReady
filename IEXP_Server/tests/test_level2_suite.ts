import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import "dotenv/config";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import connectDB from "../src/config/database.js";

const BASE_URL = "http://localhost:5000/api";
const JWT_SECRET = process.env.JWT_SECRET || "interviewready_jwt_secret_key_2026";

interface TestResult {
  id: string;
  name: string;
  category: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

const results: TestResult[] = [];

const logTest = (id: string, name: string, category: string, passed: boolean, error?: string, durationMs = 0) => {
  results.push({ id, name, category, passed, error, durationMs });
  if (passed) {
    console.log(`✅ [PASS] ${id}: ${name} (${durationMs}ms)`);
  } else {
    console.error(`❌ [FAIL] ${id}: ${name} (${durationMs}ms) -> ${error}`);
  }
};

const runLevel2Suite = async () => {
  console.log("=================================================");
  console.log("INTERVIEWREADY LEVEL 2 ADVERSARIAL QA & CONCURRENCY SUITE");
  console.log("=================================================\n");

  await connectDB();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection failed");

  const timestamp = Date.now();
  const userAEmail = `l2_userA_${timestamp}@example.com`;
  const userBEmail = `l2_userB_${timestamp}@example.com`;
  const password = "Password123!";

  // 1. Register User A & User B
  const regARes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "L2 User A", email: userAEmail, password }),
  });
  const regA = await regARes.json();
  const userAId = regA.user.id;

  const regBRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "L2 User B", email: userBEmail, password }),
  });
  const regB = await regBRes.json();
  const userBId = regB.user.id;

  // Login User A
  const loginARes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userAEmail, password }),
  });
  const loginAData = await loginARes.json();
  const tokenA = loginAData.token;

  // Login User B
  const loginBRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userBEmail, password }),
  });
  const loginBData = await loginBRes.json();
  const tokenB = loginBData.token;

  // Insert mock resume for User A so interviews can be created
  await db.collection("resumes").insertOne({
    userId: new mongoose.Types.ObjectId(userAId),
    originalFileName: "Resume_A.pdf",
    fileType: "application/pdf",
    storagePath: `${userAId}/resume.pdf`,
    extractedText: "Experienced Software Engineer with proficiency in React, Node.js, TypeScript, Distributed Systems, MongoDB.",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create Interview A for User A
  const createIntRes = await fetch(`${BASE_URL}/interviews`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenA}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role: "Senior Backend Engineer",
      interviewType: "Technical",
      difficulty: "Hard",
    }),
  });
  const createIntData = await createIntRes.json();
  const interviewId = createIntData.interview.id;

  // ==========================================
  // CATEGORY 1: AUTHENTICATION EDGE CASES
  // ==========================================
  {
    const start = Date.now();
    // AUTH-L2-001: JWT with malformed/non-ObjectId userId
    const malformedToken = jwt.sign({ userId: "invalid-user-id-not-hex" }, JWT_SECRET, { expiresIn: "1h" });
    const res = await fetch(`${BASE_URL}/interviews`, {
      headers: { Authorization: `Bearer ${malformedToken}` },
    });
    const passed = res.status === 401;
    logTest("AUTH-L2-001", "JWT with non-ObjectId userId rejected with 401", "Authentication", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // AUTH-L2-002: Expired JWT during turn submission
    const expiredToken = jwt.sign({ userId: userAId }, JWT_SECRET, { expiresIn: "-10s" });
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/turn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${expiredToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        speaker: "candidate",
        text: "Test answer",
        isQuestion: false,
      }),
    });
    const passed = res.status === 401;
    logTest("AUTH-L2-002", "Expired JWT during live turn submission rejected with 401", "Authentication", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // AUTH-L2-003: Tampered signature rejected with 401
    const tamperedToken = jwt.sign({ userId: userAId }, "wrong_secret_key_xyz", { expiresIn: "1h" });
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/session`, {
      headers: { Authorization: `Bearer ${tamperedToken}` },
    });
    const passed = res.status === 401;
    logTest("AUTH-L2-003", "JWT with tampered signature rejected with 401", "Authentication", passed, undefined, Date.now() - start);
  }

  // ==========================================
  // CATEGORY 2: ADVERSARIAL CONCURRENCY & SESSION LEASES
  // ==========================================

  const sessionA = `session_deviceA_${Date.now()}`;
  const sessionB = `session_deviceB_${Date.now()}`;

  {
    const start = Date.now();
    // Device A starts interview and acquires lease
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionA,
      },
    });
    const passed = res.status === 200;
    logTest("SESSION-L2-001", "Device A acquires session lease and starts interview", "Session Locking", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // SESSION-L2-002: Missing session ID bypass attempt on live turn
    // (Device B attempts to submit a turn without X-Session-Id header while Device A is active)
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/turn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        // Notice: NO X-Session-Id header!
      },
      body: JSON.stringify({
        speaker: "candidate",
        text: "Bypass attempt without session header",
        isQuestion: false,
      }),
    });
    const passed = res.status === 409;
    logTest("SESSION-L2-002", "Turn submission without X-Session-Id on active lease rejected with 409", "Session Locking", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // SESSION-L2-003: Missing session ID bypass attempt on live start
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        // NO X-Session-Id
      },
    });
    const passed = res.status === 409;
    logTest("SESSION-L2-003", "Start request without X-Session-Id on active lease rejected with 409", "Session Locking", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // SESSION-L2-004: Missing session ID bypass attempt on heartbeat
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/heartbeat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        // NO X-Session-Id
      },
    });
    const passed = res.status === 409;
    logTest("SESSION-L2-004", "Heartbeat without X-Session-Id on active lease rejected with 409", "Session Locking", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // SESSION-L2-005: Mismatched session ID on heartbeat
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/heartbeat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionB,
      },
    });
    const passed = res.status === 409;
    logTest("SESSION-L2-005", "Heartbeat with mismatched session ID rejected with 409", "Session Locking", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // SESSION-L2-006: Device B unauthorized complete attempt while Device A is active
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/complete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionB,
      },
      body: JSON.stringify({}),
    });
    const passed = res.status === 409;
    logTest("SESSION-L2-006", "Device B cannot complete interview actively running on Device A (409)", "Session Locking", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // SESSION-L2-007: Device B unauthorized leave attempt while Device A is active
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionB,
      },
    });
    const passed = res.status === 409;
    logTest("SESSION-L2-007", "Device B cannot force leave interview actively running on Device A (409)", "Session Locking", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // SESSION-L2-008: Legitimate owner sends heartbeat renewal
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/heartbeat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionA,
      },
    });
    const data = await res.json();
    const passed = res.status === 200 && data.active === true;
    logTest("SESSION-L2-008", "Legitimate owner Device A successfully renews session heartbeat", "Session Locking", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // SESSION-L2-009: Lease Expiration & Takeover
    // Simulate Device A going offline: set activeSessionLastHeartbeat to 50 seconds ago
    await db.collection("interviews").updateOne(
      { _id: new mongoose.Types.ObjectId(interviewId) },
      { $set: { activeSessionLastHeartbeat: new Date(Date.now() - 50_000) } }
    );

    // Device B now connects and acquires the expired lease
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionB,
      },
    });
    const passed = res.status === 200;
    logTest("SESSION-L2-009", "Device B safely acquires lease after 45s heartbeat timeout expires", "Session Recovery", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // SESSION-L2-010: Old Device A delayed request after Device B took over
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/turn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionA,
      },
      body: JSON.stringify({
        speaker: "candidate",
        text: "Delayed turn from stale device A",
        isQuestion: false,
      }),
    });
    const passed = res.status === 409;
    logTest("SESSION-L2-010", "Old Device A rejected with 409 after Device B acquired session lease", "Session Locking", passed, undefined, Date.now() - start);
  }

  // ==========================================
  // CATEGORY 3: TURN VALIDATION & RACE CONDITIONS
  // ==========================================

  {
    const start = Date.now();
    // TURN-L2-001: Device B adds valid question turn
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/turn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionB,
      },
      body: JSON.stringify({
        speaker: "interviewer",
        text: "Explain distributed consensus and Raft algorithm.",
        isQuestion: true,
      }),
    });
    const passed = res.status === 201;
    logTest("TURN-L2-001", "Interviewer posts Question turn successfully under active lease", "Turn Sequencing", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // TURN-L2-002: Rapid double submission idempotency (candidate answer)
    const turnBody = {
      speaker: "candidate",
      text: "Raft elects a leader through randomized election timers and replicates logs.",
      isQuestion: false,
    };
    const [res1, res2] = await Promise.all([
      fetch(`${BASE_URL}/interviews/${interviewId}/live/turn`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenA}`,
          "Content-Type": "application/json",
          "X-Session-Id": sessionB,
        },
        body: JSON.stringify(turnBody),
      }),
      fetch(`${BASE_URL}/interviews/${interviewId}/live/turn`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenA}`,
          "Content-Type": "application/json",
          "X-Session-Id": sessionB,
        },
        body: JSON.stringify(turnBody),
      }),
    ]);
    const passed = res1.status === 201 && (res2.status === 201 || res2.status === 200);
    logTest("TURN-L2-002", "Rapid double turn submission handles concurrency without duplicate sequence errors", "Concurrency", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // TURN-L2-003: Whitespace only text rejected with 400
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/turn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionB,
      },
      body: JSON.stringify({
        speaker: "candidate",
        text: "     ",
        isQuestion: false,
      }),
    });
    const passed = res.status === 400;
    logTest("TURN-L2-003", "Whitespace-only turn text rejected with 400", "Input Validation", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // TURN-L2-004: Invalid speaker role injection rejected with 400
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/turn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionB,
      },
      body: JSON.stringify({
        speaker: "admin",
        text: "Injecting admin prompt",
        isQuestion: false,
      }),
    });
    const passed = res.status === 400;
    logTest("TURN-L2-004", "Invalid speaker role injection rejected with 400", "Input Validation", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // TURN-L2-005: isQuestion non-boolean rejected with 400
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/turn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionB,
      },
      body: JSON.stringify({
        speaker: "candidate",
        text: "My answer",
        isQuestion: "true",
      }),
    });
    const passed = res.status === 400;
    logTest("TURN-L2-005", "isQuestion with string 'true' rejected with 400", "Input Validation", passed, undefined, Date.now() - start);
  }

  // ==========================================
  // CATEGORY 4: IDOR & AUTHORIZATION ADVERSARIAL
  // ==========================================

  {
    const start = Date.now();
    // IDOR-L2-001: User B cannot heartbeat User A's session
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/heartbeat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenB}`,
        "Content-Type": "application/json",
      },
    });
    const passed = res.status === 400 || res.status === 403 || res.status === 404;
    logTest("IDOR-L2-001", "User B cannot send heartbeat to User A's interview", "IDOR", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // IDOR-L2-002: User B cannot complete User A's interview
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/complete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenB}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const passed = res.status === 400 || res.status === 403 || res.status === 404;
    logTest("IDOR-L2-002", "User B cannot complete User A's interview", "IDOR", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // IDOR-L2-003: User B cannot leave User A's interview
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenB}`,
        "Content-Type": "application/json",
      },
    });
    const passed = res.status === 400 || res.status === 403 || res.status === 404;
    logTest("IDOR-L2-003", "User B cannot leave User A's interview", "IDOR", passed, undefined, Date.now() - start);
  }

  // ==========================================
  // CATEGORY 5: MALFORMED URL & INPUT RESILIENCE
  // ==========================================

  {
    const start = Date.now();
    // API-L2-001: Non-ObjectId string in URL does not return 500
    const res = await fetch(`${BASE_URL}/interviews/not-a-valid-id-123/live/session`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const passed = res.status === 400;
    logTest("API-L2-001", "Malformed ObjectId in route parameter returns 400, not 500", "Input Validation", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // API-L2-002: Nonexistent valid ObjectId returns 400/404, not 500
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await fetch(`${BASE_URL}/interviews/${fakeId}/live/session`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const passed = res.status === 400 || res.status === 404;
    logTest("API-L2-002", "Nonexistent valid ObjectId returns 400/404, not 500", "Error Handling", passed, undefined, Date.now() - start);
  }

  // ==========================================
  // CATEGORY 6: INTERVIEW COMPLETION & STATUS INTEGRITY
  // ==========================================

  {
    const start = Date.now();
    // Complete interview cleanly with Device B
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/complete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionB,
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    const passed = res.status === 200 && data.completed === true;
    logTest("STATUS-L2-001", "Device B completes interview cleanly and clears session lease", "Interview Lifecycle", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // STATUS-L2-002: Attempting to resume or start a completed interview returns 400
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionB,
      },
    });
    const passed = res.status === 400;
    logTest("STATUS-L2-002", "Completed interview cannot be restarted (rejected with 400)", "Status Integrity", passed, undefined, Date.now() - start);
  }

  {
    const start = Date.now();
    // STATUS-L2-003: Calling leave on a completed interview is safe (does not revert to Left)
    const res = await fetch(`${BASE_URL}/interviews/${interviewId}/live/leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
        "X-Session-Id": sessionB,
      },
    });
    const updated = await db.collection("interviews").findOne({ _id: new mongoose.Types.ObjectId(interviewId) });
    const passed = res.status === 200 && updated?.status === "Completed";
    logTest("STATUS-L2-003", "Leave call on completed interview does not corrupt status back to Left", "Status Integrity", passed, undefined, Date.now() - start);
  }

  // Clean up test users
  await db.collection("users").deleteMany({ _id: { $in: [new mongoose.Types.ObjectId(userAId), new mongoose.Types.ObjectId(regB.user.id)] } });
  await db.collection("interviews").deleteMany({ _id: new mongoose.Types.ObjectId(interviewId) });
  await db.collection("resumes").deleteMany({ userId: new mongoose.Types.ObjectId(userAId) });
  await db.collection("liveinterviewturns").deleteMany({ interviewId: new mongoose.Types.ObjectId(interviewId) });
  await mongoose.disconnect();

  console.log("\n=================================================");
  console.log("LEVEL 2 TEST SUITE EXECUTION COMPLETE");
  console.log("=================================================");
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`TOTAL: ${results.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);

  if (failedCount > 0) {
    process.exit(1);
  }
};

runLevel2Suite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
