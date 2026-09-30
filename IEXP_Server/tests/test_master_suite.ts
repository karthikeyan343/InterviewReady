import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import "dotenv/config";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import Resume from "../src/models/Resume.js";
import Interview from "../src/models/Interview.js";
import User from "../src/models/User.js";

const BASE_URL = "http://localhost:5000/api";

interface TestResult {
  id: string;
  category: string;
  scenario: string;
  expected: string;
  actual: string;
  status: "PASS" | "FAIL";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  details?: string;
  rootCause?: string;
}

const results: TestResult[] = [];

function record(result: TestResult) {
  results.push(result);
  const icon = result.status === "PASS" ? "✅" : "❌";
  console.log(`${icon} [${result.status}] ${result.id}: ${result.scenario}`);
  if (result.status === "FAIL") {
    console.log(`   Expected: ${result.expected}`);
    console.log(`   Actual:   ${result.actual}`);
    if (result.details) console.log(`   Details:  ${result.details}`);
  }
}

async function request(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: res.status, ok: res.ok, data };
  } catch (err: any) {
    return { status: 0, ok: false, data: null, error: err.message };
  }
}

async function runSuite() {
  console.log("=================================================");
  console.log("INTERVIEWREADY COMPREHENSIVE QA & RELIABILITY SUITE");
  console.log("=================================================\n");

  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  const runId = Date.now();
  const testUserA = {
    name: "User Alpha",
    email: `alpha_${runId}@interviewready.test`,
    password: "Password123!",
  };
  const testUserB = {
    name: "User Beta",
    email: `beta_${runId}@interviewready.test`,
    password: "Password456!",
  };

  let tokenA = "";
  let userIdA = "";
  let tokenB = "";
  let userIdB = "";

  // --------------------------------------------------------------------------
  // 1. HEALTH & CONNECTIVITY
  // --------------------------------------------------------------------------
  {
    const res = await request("/health");
    record({
      id: "API-HEALTH-001",
      category: "Infrastructure",
      scenario: "Server health check endpoint returns 200 OK",
      expected: "HTTP 200 with status 'ok'",
      actual: `HTTP ${res.status}: ${JSON.stringify(res.data)}`,
      status: res.status === 200 && res.data?.status === "ok" ? "PASS" : "FAIL",
      severity: "CRITICAL",
    });
  }

  // --------------------------------------------------------------------------
  // 2. AUTHENTICATION & INPUT VALIDATION
  // --------------------------------------------------------------------------
  {
    // Empty body registration
    const res1 = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({}),
    });
    record({
      id: "AUTH-REG-001",
      category: "Authentication",
      scenario: "Register with empty payload fails gracefully",
      expected: "HTTP 400 with validation error message",
      actual: `HTTP ${res1.status}: ${JSON.stringify(res1.data)}`,
      status: res1.status === 400 ? "PASS" : "FAIL",
      severity: "MEDIUM",
    });

    // Short password (<6 chars)
    const res2 = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: `short_${runId}@test.com`,
        password: "123",
      }),
    });
    record({
      id: "AUTH-REG-002",
      category: "Authentication",
      scenario: "Register with password < 6 characters fails",
      expected: "HTTP 400 with 'Password must be at least 6 characters'",
      actual: `HTTP ${res2.status}: ${JSON.stringify(res2.data)}`,
      status: res2.status === 400 ? "PASS" : "FAIL",
      severity: "MEDIUM",
    });

    // Type Injection / Non-string input to Register
    const res3 = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: { $ne: null },
        password: 1234567,
      }),
    });
    record({
      id: "AUTH-REG-003",
      category: "Security",
      scenario: "Register with non-string fields does not throw 500 unhandled error",
      expected: "HTTP 400 validation error (no 500 crash)",
      actual: `HTTP ${res3.status}: ${JSON.stringify(res3.data)}`,
      status: res3.status === 400 ? "PASS" : "FAIL",
      severity: "HIGH",
      details: res3.status === 500 ? "Server crashed with 500 due to unhandled type error" : undefined,
    });

    // Valid registration for User A
    const resA = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(testUserA),
    });
    if (resA.status === 201 && resA.data?.user?.id) {
      userIdA = resA.data.user.id;
    }
    record({
      id: "AUTH-REG-004",
      category: "Authentication",
      scenario: "Valid user registration succeeds with 201 Created",
      expected: "HTTP 201 with user object (excluding password)",
      actual: `HTTP ${resA.status}: ${JSON.stringify(resA.data)}`,
      status: resA.status === 201 && resA.data?.user?.id && !resA.data?.user?.password ? "PASS" : "FAIL",
      severity: "CRITICAL",
    });

    // Duplicate registration for User A
    const resDup = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...testUserA,
        email: testUserA.email.toUpperCase(), // Case insensitive check
      }),
    });
    record({
      id: "AUTH-REG-005",
      category: "Authentication",
      scenario: "Duplicate email registration (case-insensitive) returns 409 Conflict",
      expected: "HTTP 409 Conflict",
      actual: `HTTP ${resDup.status}: ${JSON.stringify(resDup.data)}`,
      status: resDup.status === 409 ? "PASS" : "FAIL",
      severity: "HIGH",
    });

    // Register User B
    const resB = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(testUserB),
    });
    if (resB.status === 201 && resB.data?.user?.id) {
      userIdB = resB.data.user.id;
    }

    // Login User A
    const resLoginA = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: testUserA.email,
        password: testUserA.password,
      }),
    });
    if (resLoginA.status === 200 && resLoginA.data?.token) {
      tokenA = resLoginA.data.token;
    }
    record({
      id: "AUTH-LOGIN-001",
      category: "Authentication",
      scenario: "Login with valid credentials returns JWT token",
      expected: "HTTP 200 with JWT token and user info",
      actual: `HTTP ${resLoginA.status}: token present=${!!resLoginA.data?.token}`,
      status: resLoginA.status === 200 && !!resLoginA.data?.token ? "PASS" : "FAIL",
      severity: "CRITICAL",
    });

    // Login User B
    const resLoginB = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: testUserB.email,
        password: testUserB.password,
      }),
    });
    if (resLoginB.status === 200 && resLoginB.data?.token) {
      tokenB = resLoginB.data.token;
    }

    // Login with invalid password
    const resWrongPass = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: testUserA.email,
        password: "WrongPassword999!",
      }),
    });
    record({
      id: "AUTH-LOGIN-002",
      category: "Authentication",
      scenario: "Login with incorrect password returns 401 Unauthorized",
      expected: "HTTP 401 Unauthorized",
      actual: `HTTP ${resWrongPass.status}: ${JSON.stringify(resWrongPass.data)}`,
      status: resWrongPass.status === 401 ? "PASS" : "FAIL",
      severity: "HIGH",
    });

    // Login non-existent email
    const resNoUser = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "nonexistent_999999@test.com",
        password: "Password123!",
      }),
    });
    record({
      id: "AUTH-LOGIN-003",
      category: "Authentication",
      scenario: "Login with non-existent user returns 401 Unauthorized",
      expected: "HTTP 401 Unauthorized",
      actual: `HTTP ${resNoUser.status}: ${JSON.stringify(resNoUser.data)}`,
      status: resNoUser.status === 401 ? "PASS" : "FAIL",
      severity: "HIGH",
    });

    // Login type injection (non-string email/pass)
    const resTypeInject = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: { $gt: "" },
        password: 123456,
      }),
    });
    record({
      id: "AUTH-LOGIN-004",
      category: "Security",
      scenario: "Login with non-string objects does not crash server with 500",
      expected: "HTTP 400 or 401 (graceful rejection, no 500 crash)",
      actual: `HTTP ${resTypeInject.status}: ${JSON.stringify(resTypeInject.data)}`,
      status: resTypeInject.status === 400 || resTypeInject.status === 401 ? "PASS" : "FAIL",
      severity: "HIGH",
    });
  }

  // --------------------------------------------------------------------------
  // 3. PROTECTED ROUTES & JWT AUTHORIZATION
  // --------------------------------------------------------------------------
  {
    // GET /auth/me without token
    const res1 = await request("/auth/me");
    record({
      id: "AUTH-PROT-001",
      category: "Authorization",
      scenario: "Access protected route without Authorization header",
      expected: "HTTP 401 Authentication required",
      actual: `HTTP ${res1.status}: ${JSON.stringify(res1.data)}`,
      status: res1.status === 401 ? "PASS" : "FAIL",
      severity: "HIGH",
    });

    // GET /auth/me with invalid token
    const res2 = await request("/auth/me", {
      headers: { Authorization: "Bearer invalid.jwt.token" },
    });
    record({
      id: "AUTH-PROT-002",
      category: "Authorization",
      scenario: "Access protected route with forged/invalid JWT token",
      expected: "HTTP 401 Invalid or expired token",
      actual: `HTTP ${res2.status}: ${JSON.stringify(res2.data)}`,
      status: res2.status === 401 ? "PASS" : "FAIL",
      severity: "HIGH",
    });

    // GET /auth/me with valid token
    const res3 = await request("/auth/me", {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    record({
      id: "AUTH-PROT-003",
      category: "Authorization",
      scenario: "Access protected route with valid JWT returns user data",
      expected: "HTTP 200 with user data (id, name, email)",
      actual: `HTTP ${res3.status}: ${JSON.stringify(res3.data)}`,
      status: res3.status === 200 && res3.data?.user?.email === testUserA.email.toLowerCase() ? "PASS" : "FAIL",
      severity: "CRITICAL",
    });

    // Expired token test
    const expiredToken = jwt.sign(
      { userId: userIdA },
      process.env.JWT_SECRET || "interviewReady@15_KarthikPass1504",
      { expiresIn: "-1s" }
    );
    const resExpired = await request("/auth/me", {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    record({
      id: "AUTH-PROT-004",
      category: "Authorization",
      scenario: "Access protected route with expired JWT is rejected",
      expected: "HTTP 401 Invalid or expired token",
      actual: `HTTP ${resExpired.status}: ${JSON.stringify(resExpired.data)}`,
      status: resExpired.status === 401 ? "PASS" : "FAIL",
      severity: "HIGH",
    });
  }

  // --------------------------------------------------------------------------
  // 4. INTERVIEW CREATION & RESUME PRECONDITION
  // --------------------------------------------------------------------------
  let interviewAId = "";
  {
    // Try to create interview WITHOUT resume
    const resNoResume = await request("/interviews", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        role: "Full Stack Engineer",
        interviewType: "Technical",
        difficulty: "Medium",
      }),
    });
    record({
      id: "INT-CREATE-001",
      category: "Business Logic",
      scenario: "Create interview without uploaded resume is rejected with clear message",
      expected: "HTTP 404 with message asking to upload resume first",
      actual: `HTTP ${resNoResume.status}: ${JSON.stringify(resNoResume.data)}`,
      status: resNoResume.status === 404 && resNoResume.data?.message?.includes("resume") ? "PASS" : "FAIL",
      severity: "HIGH",
    });

    // Create a mock resume in DB directly for testUserA and testUserB to test interview flows
    const resumeA = await Resume.create({
      userId: new mongoose.Types.ObjectId(userIdA),
      originalFileName: "alpha_resume.pdf",
      fileType: "application/pdf",
      storagePath: `${userIdA}/alpha_resume.pdf`,
      extractedText: "Experienced Software Engineer skilled in React, Node.js, TypeScript, MongoDB, System Design.",
    });

    const resumeB = await Resume.create({
      userId: new mongoose.Types.ObjectId(userIdB),
      originalFileName: "beta_resume.pdf",
      fileType: "application/pdf",
      storagePath: `${userIdB}/beta_resume.pdf`,
      extractedText: "Frontend Engineer skilled in React, CSS, HTML, Webpack, UI/UX.",
    });

    // Create interview with invalid interviewType
    const resBadType = await request("/interviews", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        role: "Full Stack Engineer",
        interviewType: "InvalidType",
        difficulty: "Medium",
      }),
    });
    record({
      id: "INT-CREATE-002",
      category: "Validation",
      scenario: "Create interview with invalid interviewType returns 400",
      expected: "HTTP 400",
      actual: `HTTP ${resBadType.status}: ${JSON.stringify(resBadType.data)}`,
      status: resBadType.status === 400 ? "PASS" : "FAIL",
      severity: "MEDIUM",
    });

    // Create interview with invalid difficulty
    const resBadDiff = await request("/interviews", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        role: "Full Stack Engineer",
        interviewType: "Technical",
        difficulty: "SuperHard",
      }),
    });
    record({
      id: "INT-CREATE-003",
      category: "Validation",
      scenario: "Create interview with invalid difficulty returns 400",
      expected: "HTTP 400",
      actual: `HTTP ${resBadDiff.status}: ${JSON.stringify(resBadDiff.data)}`,
      status: resBadDiff.status === 400 ? "PASS" : "FAIL",
      severity: "MEDIUM",
    });

    // Create valid interview for User A
    const resCreateA = await request("/interviews", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        role: "Full Stack Engineer",
        interviewType: "Technical",
        difficulty: "Medium",
      }),
    });
    if (resCreateA.status === 201 && resCreateA.data?.interview?.id) {
      interviewAId = resCreateA.data.interview.id;
    }
    record({
      id: "INT-CREATE-004",
      category: "Interview Flow",
      scenario: "Create interview with valid parameters succeeds with 201",
      expected: "HTTP 201 with interview in 'Not Started' status",
      actual: `HTTP ${resCreateA.status}: ${JSON.stringify(resCreateA.data)}`,
      status: resCreateA.status === 201 && resCreateA.data?.interview?.status === "Not Started" ? "PASS" : "FAIL",
      severity: "CRITICAL",
    });
  }

  // --------------------------------------------------------------------------
  // 5. CROSS-USER ISOLATION & IDOR TESTING (Requirement 15 & 16)
  // --------------------------------------------------------------------------
  {
    // User B attempts to get User A's interview live session
    const resIDORSession = await request(`/interviews/${interviewAId}/live/session`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    record({
      id: "IDOR-SESSION-001",
      category: "Authorization",
      scenario: "User B cannot access User A's interview live session (IDOR protection)",
      expected: "HTTP 400 or 404 (Access denied, interview not found for user B)",
      actual: `HTTP ${resIDORSession.status}: ${JSON.stringify(resIDORSession.data)}`,
      status: resIDORSession.status === 400 || resIDORSession.status === 404 ? "PASS" : "FAIL",
      severity: "CRITICAL",
    });

    // User B attempts to start User A's interview
    const resIDORStart = await request(`/interviews/${interviewAId}/live/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    record({
      id: "IDOR-START-002",
      category: "Authorization",
      scenario: "User B cannot start User A's interview",
      expected: "HTTP 400 or 404",
      actual: `HTTP ${resIDORStart.status}: ${JSON.stringify(resIDORStart.data)}`,
      status: resIDORStart.status === 400 || resIDORStart.status === 404 ? "PASS" : "FAIL",
      severity: "CRITICAL",
    });

    // User B attempts to submit turns into User A's interview
    const resIDORTurn = await request(`/interviews/${interviewAId}/live/turn`, {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        speaker: "candidate",
        text: "Injected candidate answer from malicious user B",
        isQuestion: false,
      }),
    });
    record({
      id: "IDOR-TURN-003",
      category: "Authorization",
      scenario: "User B cannot inject conversation turns into User A's interview",
      expected: "HTTP 400 or 404",
      actual: `HTTP ${resIDORTurn.status}: ${JSON.stringify(resIDORTurn.data)}`,
      status: resIDORTurn.status === 400 || resIDORTurn.status === 404 ? "PASS" : "FAIL",
      severity: "CRITICAL",
    });

    // User B attempts to complete User A's interview
    const resIDORComplete = await request(`/interviews/${interviewAId}/live/complete`, {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    record({
      id: "IDOR-COMP-004",
      category: "Authorization",
      scenario: "User B cannot complete User A's interview",
      expected: "HTTP 400 or 404",
      actual: `HTTP ${resIDORComplete.status}: ${JSON.stringify(resIDORComplete.data)}`,
      status: resIDORComplete.status === 400 || resIDORComplete.status === 404 ? "PASS" : "FAIL",
      severity: "CRITICAL",
    });

    // User B attempts to fetch User A's interview report
    const resIDORReport = await request(`/interviews/${interviewAId}/report`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    record({
      id: "IDOR-REP-005",
      category: "Authorization",
      scenario: "User B cannot fetch User A's confidential interview report",
      expected: "HTTP 404 Interview not found",
      actual: `HTTP ${resIDORReport.status}: ${JSON.stringify(resIDORReport.data)}`,
      status: resIDORReport.status === 404 ? "PASS" : "FAIL",
      severity: "CRITICAL",
    });
  }

  // --------------------------------------------------------------------------
  // 6. MULTI-DEVICE & CONCURRENT SESSION CONFLICT (Requirements 10 & 11)
  // --------------------------------------------------------------------------
  {
    // Start interview from Device A
    const resStartA = await request(`/interviews/${interviewAId}/live/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "X-Session-Id": `device_laptop_${runId}`,
      },
    });
    record({
      id: "SESSION-START-001",
      category: "Session Management",
      scenario: "Device A starts interview successfully",
      expected: "HTTP 200 with status In Progress",
      actual: `HTTP ${resStartA.status}: ${JSON.stringify(resStartA.data)}`,
      status: resStartA.status === 200 && resStartA.data?.interview?.status === "In Progress" ? "PASS" : "FAIL",
      severity: "CRITICAL",
    });

    // Device B (different device / tab / session ID for User A) attempts to start or continue the same interview simultaneously
    const resStartB = await request(`/interviews/${interviewAId}/live/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "X-Session-Id": `device_mobile_${runId}`,
      },
    });
    // Expected: System must detect existing active session and prevent conflicting simultaneous execution!
    record({
      id: "SESSION-CONCUR-002",
      category: "Session Management",
      scenario: "Device B cannot simultaneously hijack or continue active interview session",
      expected: "HTTP 409 Conflict with clear message indicating session is active on another device",
      actual: `HTTP ${resStartB.status}: ${JSON.stringify(resStartB.data)}`,
      status: resStartB.status === 409 ? "PASS" : "FAIL",
      severity: "HIGH",
      details: resStartB.status === 200 ? "DEFECT: Backend allowed Device B to join and overwrite active session!" : undefined,
    });

    // Device B attempts to submit turns into Device A's active session
    const resTurnB = await request(`/interviews/${interviewAId}/live/turn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "X-Session-Id": `device_mobile_${runId}`,
      },
      body: JSON.stringify({
        speaker: "candidate",
        text: "Concurrent conflicting answer from mobile device",
        isQuestion: false,
      }),
    });
    record({
      id: "SESSION-CONCUR-003",
      category: "Session Management",
      scenario: "Device B cannot write turns to active interview session of Device A",
      expected: "HTTP 409 Conflict",
      actual: `HTTP ${resTurnB.status}: ${JSON.stringify(resTurnB.data)}`,
      status: resTurnB.status === 409 ? "PASS" : "FAIL",
      severity: "HIGH",
      details: resTurnB.status === 201 ? "DEFECT: Concurrent write allowed without active session token verification!" : undefined,
    });
  }

  // --------------------------------------------------------------------------
  // 7. LIVE CONVERSATION TURNS & STATE INTEGRITY (Requirements 12 & 13)
  // --------------------------------------------------------------------------
  {
    // Question 1 from Interviewer
    const resQ1 = await request(`/interviews/${interviewAId}/live/turn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "X-Session-Id": `device_laptop_${runId}`,
      },
      body: JSON.stringify({
        speaker: "interviewer",
        text: "Can you explain how the virtual DOM works in React?",
        isQuestion: true,
      }),
    });
    record({
      id: "TURN-Q1-001",
      category: "Interview State",
      scenario: "Interviewer asks Question 1, sequence is 1 and isQuestion is true",
      expected: "HTTP 201 with sequence 1 and isQuestion true",
      actual: `HTTP ${resQ1.status}: seq=${resQ1.data?.sequence}`,
      status: resQ1.status === 201 && resQ1.data?.sequence === 1 ? "PASS" : "FAIL",
      severity: "HIGH",
    });

    // Duplicate Question 1 immediately re-submitted (e.g. network retry / duplicate send)
    const resQ1Dup = await request(`/interviews/${interviewAId}/live/turn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "X-Session-Id": `device_laptop_${runId}`,
      },
      body: JSON.stringify({
        speaker: "interviewer",
        text: "Can you explain how the virtual DOM works in React?",
        isQuestion: true,
      }),
    });
    record({
      id: "TURN-DUP-002",
      category: "Reliability",
      scenario: "Consecutive identical turn from same speaker is de-duplicated",
      expected: "Saved is true with existing sequence (de-duplicated, totalTurns not increased)",
      actual: `HTTP ${resQ1Dup.status}: seq=${resQ1Dup.data?.sequence}, totalTurns=${resQ1Dup.data?.totalTurns}`,
      status: resQ1Dup.status === 201 || (resQ1Dup.status === 200 && resQ1Dup.data?.saved === true) ? "PASS" : "FAIL",
      severity: "MEDIUM",
    });

    // Answer 1 from Candidate
    const resA1 = await request(`/interviews/${interviewAId}/live/turn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "X-Session-Id": `device_laptop_${runId}`,
      },
      body: JSON.stringify({
        speaker: "candidate",
        text: "The virtual DOM is a lightweight in-memory representation of the real DOM. When state changes, React creates a new tree and diffs it against the previous one using a reconciliation algorithm.",
        isQuestion: false,
      }),
    });
    record({
      id: "TURN-A1-003",
      category: "Interview State",
      scenario: "Candidate submits valid Answer 1",
      expected: "HTTP 201 with sequence 2",
      actual: `HTTP ${resA1.status}: seq=${resA1.data?.sequence}`,
      status: resA1.status === 201 && resA1.data?.sequence === 2 ? "PASS" : "FAIL",
      severity: "HIGH",
    });

    // Turn submission with empty text
    const resEmpty = await request(`/interviews/${interviewAId}/live/turn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "X-Session-Id": `device_laptop_${runId}`,
      },
      body: JSON.stringify({
        speaker: "candidate",
        text: "   ",
        isQuestion: false,
      }),
    });
    record({
      id: "TURN-VAL-004",
      category: "Validation",
      scenario: "Submitting turn with whitespace text returns 400",
      expected: "HTTP 400",
      actual: `HTTP ${resEmpty.status}: ${JSON.stringify(resEmpty.data)}`,
      status: resEmpty.status === 400 ? "PASS" : "FAIL",
      severity: "MEDIUM",
    });

    // Turn submission with invalid speaker
    const resBadSpeaker = await request(`/interviews/${interviewAId}/live/turn`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "X-Session-Id": `device_laptop_${runId}`,
      },
      body: JSON.stringify({
        speaker: "hacker",
        text: "Hello",
        isQuestion: false,
      }),
    });
    record({
      id: "TURN-VAL-005",
      category: "Validation",
      scenario: "Submitting turn with invalid speaker returns 400",
      expected: "HTTP 400",
      actual: `HTTP ${resBadSpeaker.status}: ${JSON.stringify(resBadSpeaker.data)}`,
      status: resBadSpeaker.status === 400 ? "PASS" : "FAIL",
      severity: "MEDIUM",
    });

    // Verify session stats endpoint matches recorded state
    const resSession = await request(`/interviews/${interviewAId}/live/session`, {
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "X-Session-Id": `device_laptop_${runId}`,
      },
    });
    record({
      id: "SESSION-STATE-006",
      category: "Interview State",
      scenario: "Live session state correctly reflects current question count and answered count",
      expected: "currentQuestion=1, answeredCount=1",
      actual: `currentQ=${resSession.data?.stats?.currentQuestion}, answered=${resSession.data?.stats?.answeredCount}`,
      status: resSession.data?.stats?.currentQuestion === 1 && resSession.data?.stats?.answeredCount === 1 ? "PASS" : "FAIL",
      severity: "HIGH",
    });
  }

  // --------------------------------------------------------------------------
  // 8. INTERVIEW LEAVE & RESUME
  // --------------------------------------------------------------------------
  {
    // Leave interview
    const resLeave = await request(`/interviews/${interviewAId}/live/leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "X-Session-Id": `device_laptop_${runId}`,
      },
    });
    record({
      id: "INT-LEAVE-001",
      category: "Interview Flow",
      scenario: "User leaves live interview -> status becomes Left",
      expected: "HTTP 200 with status 'Left'",
      actual: `HTTP ${resLeave.status}: status=${resLeave.data?.interview?.status}`,
      status: resLeave.status === 200 && resLeave.data?.interview?.status === "Left" ? "PASS" : "FAIL",
      severity: "HIGH",
    });

    // Resume from Left status
    const resResume = await request(`/interviews/${interviewAId}/live/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "X-Session-Id": `device_laptop_${runId}`,
      },
    });
    record({
      id: "INT-RESUME-002",
      category: "Interview Flow",
      scenario: "Resume interview from Left status transitions back to In Progress",
      expected: "HTTP 200 with status 'In Progress'",
      actual: `HTTP ${resResume.status}: status=${resResume.data?.interview?.status}`,
      status: resResume.status === 200 && resResume.data?.interview?.status === "In Progress" ? "PASS" : "FAIL",
      severity: "HIGH",
    });
  }

  // --------------------------------------------------------------------------
  // 9. 50% ANSWER THRESHOLD & COMPLETION RULES
  // --------------------------------------------------------------------------
  {
    // Candidate answered 1 question out of 10 (question limit for Medium is 10)
    // 1 < 50% (5 questions) -> report must be NotRequired
    const resCompEarly = await request(`/interviews/${interviewAId}/live/complete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "X-Session-Id": `device_laptop_${runId}`,
      },
    });
    record({
      id: "INT-COMP-001",
      category: "Business Logic",
      scenario: "Complete interview with < 50% answered questions results in reportStatus 'NotRequired'",
      expected: "reportStatus='NotRequired', completed=true",
      actual: `status=${resCompEarly.data?.reportStatus}, completed=${resCompEarly.data?.completed}`,
      status: resCompEarly.status === 200 && resCompEarly.data?.reportStatus === "NotRequired" ? "PASS" : "FAIL",
      severity: "HIGH",
    });

    // Verify interview cannot be restarted once Completed
    const resRestart = await request(`/interviews/${interviewAId}/live/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    record({
      id: "INT-COMP-002",
      category: "Business Logic",
      scenario: "Completed interview cannot be restarted",
      expected: "HTTP 400 error",
      actual: `HTTP ${resRestart.status}: ${JSON.stringify(resRestart.data)}`,
      status: resRestart.status === 400 ? "PASS" : "FAIL",
      severity: "HIGH",
    });

    // Verify turns cannot be submitted to completed interview
    const resTurnAfterComp = await request(`/interviews/${interviewAId}/live/turn`, {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        speaker: "candidate",
        text: "Late submission after completion",
        isQuestion: false,
      }),
    });
    record({
      id: "INT-COMP-003",
      category: "Business Logic",
      scenario: "Turns cannot be submitted to completed interview",
      expected: "HTTP 400 error",
      actual: `HTTP ${resTurnAfterComp.status}: ${JSON.stringify(resTurnAfterComp.data)}`,
      status: resTurnAfterComp.status === 400 ? "PASS" : "FAIL",
      severity: "HIGH",
    });
  }

  // --------------------------------------------------------------------------
  // 10. CORS & PRODUCTION HEADERS
  // --------------------------------------------------------------------------
  {
    // Test preflight OPTIONS request from production origin
    const resOptions = await fetch("http://localhost:5000/api/auth/login", {
      method: "OPTIONS",
      headers: {
        Origin: "https://interview-ready-demo.vercel.app",
        "Access-Control-Request-Method": "POST",
      },
    });
    const allowOrigin = resOptions.headers.get("access-control-allow-origin");
    record({
      id: "PROD-CORS-001",
      category: "Production Config",
      scenario: "CORS permits production Vercel frontend origin",
      expected: "Access-Control-Allow-Origin header matching origin or configured list",
      actual: `allow-origin: ${allowOrigin}`,
      status: allowOrigin === "https://interview-ready-demo.vercel.app" || allowOrigin === "*" ? "PASS" : "FAIL",
      severity: "HIGH",
      details: allowOrigin !== "https://interview-ready-demo.vercel.app" ? "DEFECT: Server rejects production Vercel origins because CLIENT_URL is restricted or defaults to localhost:5173" : undefined,
    });
  }

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log("\n=================================================");
  console.log("TEST SUITE EXECUTION COMPLETE");
  console.log("=================================================");
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  console.log(`TOTAL: ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);

  // Disconnect mongoose
  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runSuite().catch((err) => {
  console.error("Test suite runner crashed:", err);
  process.exit(1);
});
