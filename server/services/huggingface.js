import { InferenceClient } from "@huggingface/inference";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env or server/.env
dotenv.config();
if (!process.env.HF_TOKEN) {
  dotenv.config({ path: path.resolve(process.cwd(), "server", ".env") });
}

/**
 * System Prompt defines StudyMate AI's personality, teaching philosophy,
 * and behavior rules. It instructs the model to act as a university tutor
 * supporting English, Bangla, and Banglish.
 */
export const SYSTEM_PROMPT = `You are StudyMate AI, a friendly and intelligent AI tutor for university students.

Your goal is to help students understand concepts instead of simply giving answers.

Rules:

1. Support English, Bangla and Banglish.
2. If the user writes Banglish, you may reply in natural Bangla.
3. Explain difficult concepts in simple language.
4. Use examples whenever useful.
5. For programming questions, provide clean and beginner-friendly code.
6. Explain code when appropriate.
7. For exam preparation, focus on understanding and concise revision.
8. If asked to generate MCQs, generate clear questions with answers.
9. If asked for a study plan, create a realistic structured plan.
10. Be encouraging but not unnecessarily verbose.
11. If the question is unclear, ask a short clarification.
12. Never claim to have access to private university information unless the user provides it.
13. Do not fabricate facts.
14. When appropriate, use Markdown formatting.`;

/**
 * Returns an instance of the Hugging Face InferenceClient using the token from environment variables.
 */
export function getHFClient() {
  const token = process.env.HF_TOKEN;
  return new InferenceClient(token);
}

/**
 * Sanitizes messages and ensures they match the format expected by Hugging Face chat completion.
 * @param {Array<{role: string, content: string}>} rawMessages
 * @returns {Array<{role: string, content: string}>}
 */
export function formatMessagesForChat(rawMessages) {
  return rawMessages.map((msg) => ({
    role: msg.role === "assistant" || msg.role === "ai" ? "assistant" : "user",
    content: typeof msg.content === "string" ? msg.content.trim() : String(msg.content || ""),
  }));
}

/**
 * Sends conversation messages to Hugging Face chat completion API.
 * 
 * @param {Array<{role: string, content: string}>} messages - Prior messages in the conversation
 * @returns {Promise<string>} The AI tutor's text response
 */
export async function generateChatReply(messages) {
  const token = process.env.HF_TOKEN;

  // Check if token is missing or still set to the default placeholder
  if (
    !token ||
    token === "your_huggingface_token" ||
    token === "your_huggingface_token_here" ||
    token.trim() === ""
  ) {
    const error = new Error(
      "Hugging Face API token is missing or not configured. For local development, set HF_TOKEN in `server/.env`. For Vercel deployment, add `HF_TOKEN` in your Vercel Project Settings > Environment Variables."
    );
    error.statusCode = 401;
    throw error;
  }

  const model = process.env.HF_MODEL || "openai/gpt-oss-120b";
  const client = getHFClient();

  // Combine system instruction with conversation history
  const formattedChat = [
    { role: "system", content: SYSTEM_PROMPT },
    ...formatMessagesForChat(messages),
  ];

  try {
    const response = await client.chatCompletion({
      model,
      messages: formattedChat,
      max_tokens: 1500,
      temperature: 0.7,
    });

    const reply = response.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("No response content received from Hugging Face model.");
    }

    return reply;
  } catch (err) {
    // If the error was our own 401 check, rethrow it
    if (err.statusCode === 401) {
      throw err;
    }

    // Protect sensitive tokens from being printed or exposed in stack traces
    const safeErrorMsg = err.message ? err.message.replace(/hf_[a-zA-Z0-9]+/g, "[REDACTED_TOKEN]") : "Unknown error";
    console.error("Hugging Face API Error:", safeErrorMsg);

    // Provide friendly, non-leaking error description
    const customError = new Error(
      "Failed to get a response from the AI tutor. Please verify your Hugging Face token and model availability, or try again shortly."
    );
    customError.statusCode = 500;
    throw customError;
  }
}
