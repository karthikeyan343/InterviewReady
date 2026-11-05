import { API_BASE_URL, MODEL_NAME } from "./types";

export async function fetchLiveToken(interviewId: string): Promise<string> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const sessionId =
    sessionStorage.getItem(`interview_session_${interviewId}`) || "";

  const response = await fetch(
    `${API_BASE_URL}/interviews/${interviewId}/live-token`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(sessionId ? { "X-Session-Id": sessionId } : {}),
      },
    },
  );

  let data: {
    token?: string;
    model?: string;
    interviewId?: string;
    message?: string;
  } = {};

  try {
    data = await response.json();
  } catch {
    // Response body is not valid JSON
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to create Gemini Live session.");
  }

  const ephemeralToken = data.token;
  if (!ephemeralToken) {
    throw new Error("Gemini Live token was not returned.");
  }

  return ephemeralToken;
}

export function buildSetupMessage(resumptionHandle: string | null) {
  const setupMessage: {
    setup: {
      model: string;
      generationConfig: {
        responseModalities: string[];
      };
      inputAudioTranscription: Record<string, never>;
      outputAudioTranscription: Record<string, never>;
      sessionResumption?: {
        handle: string;
      };
    };
  } = {
    setup: {
      model: `models/${MODEL_NAME}`,
      generationConfig: {
        responseModalities: ["AUDIO"],
      },
      inputAudioTranscription: {},
      outputAudioTranscription: {},
    },
  };

  if (resumptionHandle) {
    setupMessage.setup.sessionResumption = {
      handle: resumptionHandle,
    };
  }

  return setupMessage;
}

