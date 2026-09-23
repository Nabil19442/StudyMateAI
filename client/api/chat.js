import { InferenceClient } from "@huggingface/inference";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
if (!process.env.HF_TOKEN) {
  dotenv.config({ path: path.resolve(process.cwd(), "..", "server", ".env") });
  dotenv.config({ path: path.resolve(process.cwd(), "server", ".env") });
}

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

function formatMessages(raw) {
  return raw.map((msg) => ({
    role: msg.role === "assistant" || msg.role === "ai" ? "assistant" : "user",
    content: typeof msg.content === "string" ? msg.content.trim() : String(msg.content || ""),
  }));
}

/**
 * Vercel Serverless Function for POST /api/chat (client subdirectory)
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: `Method ${req.method} not allowed. Please use POST.`,
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Invalid request: 'messages' must be a non-empty array of message objects.",
      });
    }

    const lastMessage = messages[messages.length - 1];
    if (
      !lastMessage ||
      !lastMessage.content ||
      typeof lastMessage.content !== "string" ||
      lastMessage.content.trim() === ""
    ) {
      return res.status(400).json({
        error: "Invalid request: The last message must have non-empty text content.",
      });
    }

    const token = process.env.HF_TOKEN;
    if (
      !token ||
      token === "your_huggingface_token" ||
      token === "your_huggingface_token_here" ||
      token.trim() === ""
    ) {
      return res.status(401).json({
        error:
          "Hugging Face API token is missing or not configured. Please add `HF_TOKEN` in your Vercel Project Settings > Environment Variables.",
      });
    }

    const model = process.env.HF_MODEL || "openai/gpt-oss-120b";
    const client = new InferenceClient(token);

    const chatResponse = await client.chatCompletion({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...formatMessages(messages),
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const reply = chatResponse.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({
        error: "No response content received from Hugging Face model.",
      });
    }

    return res.status(200).json({
      reply,
    });
  } catch (err) {
    const safeErrorMsg = err.message ? err.message.replace(/hf_[a-zA-Z0-9]+/g, "[REDACTED_TOKEN]") : "Unknown error";
    console.error("Vercel /api/chat error:", safeErrorMsg);
    return res.status(500).json({
      error:
        "StudyMate AI encountered an issue contacting the AI model. Please verify your Hugging Face token and model availability, or try again shortly.",
    });
  }
}
