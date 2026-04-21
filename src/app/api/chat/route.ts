import { NextRequest, NextResponse } from "next/server";
import {
  generateChatResponse,
  type ChatMessage,
  GroqApiError,
} from "@/lib/groq";

export const runtime = "nodejs";

const MAX_CONTEXT_MESSAGES = 12;

function isValidMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ChatMessage>;

  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const messages = (body as { messages?: unknown })?.messages;

  if (!Array.isArray(messages)) {
    return NextResponse.json(
      { error: "Invalid input. Expected messages array." },
      { status: 400 }
    );
  }

  if (!messages.every(isValidMessage)) {
    return NextResponse.json(
      { error: "Invalid message format." },
      { status: 400 }
    );
  }

  const conversation = messages.slice(-MAX_CONTEXT_MESSAGES);
  const latestUserMessage = [...conversation]
    .reverse()
    .find((message) => message.role === "user");

  if (!latestUserMessage) {
    return NextResponse.json(
      { error: "At least one user message is required." },
      { status: 400 }
    );
  }

  try {
    const reply = await generateChatResponse(conversation);
    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    if (error instanceof GroqApiError) {
      const headers = new Headers();
      if (error.retryAfterSeconds) {
        headers.set("Retry-After", String(error.retryAfterSeconds));
      }

      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers }
      );
    }

    console.error("Chat route error", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
