import Groq from "groq-sdk";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export class GroqApiError extends Error {
  status: number;
  retryAfterSeconds?: number;

  constructor(message: string, status = 500, retryAfterSeconds?: number) {
    super(message);
    this.name = "GroqApiError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

const DEFAULT_MODELS = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile"];

function getClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "your_api_key_here") {
    throw new GroqApiError("GROQ_API_KEY is not configured on the server.", 500);
  }

  return new Groq({ apiKey });
}

function getModelCandidates() {
  const configuredModel = process.env.GROQ_MODEL?.trim();

  if (!configuredModel) {
    return DEFAULT_MODELS;
  }

  return [configuredModel, ...DEFAULT_MODELS.filter((model) => model !== configuredModel)];
}

function isModelNotFoundError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as { status?: unknown; message?: unknown };
  const has404Status = candidate.status === 404;
  const message = typeof candidate.message === "string" ? candidate.message : "";

  return has404Status || (message.toLowerCase().includes("model") && message.toLowerCase().includes("not found"));
}

function parseRetryAfterSeconds(error: unknown) {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const candidate = error as {
    headers?: unknown;
  };

  const headers = candidate.headers;

  if (headers && typeof headers === "object" && "get" in headers && typeof (headers as { get?: unknown }).get === "function") {
    const retryAfter = (headers as { get: (key: string) => string | null }).get("retry-after");
    if (retryAfter) {
      const parsed = Number.parseInt(retryAfter, 10);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function toGroqApiError(error: unknown) {
  if (error instanceof GroqApiError) {
    return error;
  }

  const candidate = error as {
    status?: unknown;
    message?: unknown;
  };

  const status = typeof candidate?.status === "number" ? candidate.status : 500;
  const rawMessage = typeof candidate?.message === "string" ? candidate.message : "";
  const retryAfterSeconds = parseRetryAfterSeconds(error);

  if (status === 429) {
    const retryHint = retryAfterSeconds ? ` Please retry in about ${retryAfterSeconds}s.` : "";
    return new GroqApiError(
      `Groq API rate limit reached.${retryHint} Check your plan and rate limits in Groq Console.`,
      429,
      retryAfterSeconds
    );
  }

  if (status >= 400 && rawMessage) {
    return new GroqApiError(rawMessage, status, retryAfterSeconds);
  }

  return new GroqApiError("Unable to generate a response from Groq.", 500, retryAfterSeconds);
}

function toGroqMessages(messages: ChatMessage[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

function getAssistantReplyContent(content: unknown) {
  if (typeof content === "string") {
    return content.trim();
  }

  if (!Array.isArray(content)) {
    return "";
  }

  const combined = content
    .map((item) => {
      if (!item || typeof item !== "object") {
        return "";
      }

      const maybeText = item as { text?: unknown };
      return typeof maybeText.text === "string" ? maybeText.text : "";
    })
    .join("")
    .trim();

  return combined;
}

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  const cleanedMessages = messages.filter(
    (message) =>
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim().length > 0
  );

  if (cleanedMessages.length === 0) {
    throw new Error("No valid messages were provided.");
  }

  const groq = getClient();
  const modelCandidates = getModelCandidates();
  const chatMessages = toGroqMessages(cleanedMessages);
  let lastError: unknown;

  for (const modelName of modelCandidates) {
    try {
      const completion = await groq.chat.completions.create({
        model: modelName,
        messages: chatMessages,
        temperature: 0.7,
        max_completion_tokens: 1024,
      });

      const reply = getAssistantReplyContent(completion.choices[0]?.message?.content);

      if (!reply) {
        throw new Error("Groq returned an empty response.");
      }

      return reply;
    } catch (error) {
      lastError = error;

      if (!isModelNotFoundError(error)) {
        throw toGroqApiError(error);
      }
    }
  }

  throw toGroqApiError(lastError ?? new Error("Unable to generate a response from Groq."));
}