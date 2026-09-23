import { generateChatReply } from "../server/services/huggingface.js";

/**
 * Vercel Serverless Function for POST /api/chat
 * Handles incoming chat messages, validates requests,
 * and calls the Hugging Face Inference API.
 */
export default async function handler(req, res) {
  // 1. Enable Cross-Origin Resource Sharing (CORS) headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  res.setHeader("Content-Type", "application/json");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests for chat
  if (req.method !== "POST") {
    return res.status(405).json({
      error: `Method ${req.method} not allowed. Please use POST.`,
    });
  }

  try {
    // 2. Parse request payload safely
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { messages } = body;

    // 3. Validation: Check if messages array exists and is not empty
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Invalid request: 'messages' must be a non-empty array of message objects.",
      });
    }

    // 4. Validation: Check if last message contains non-empty text content
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

    // 5. Generate AI reply using Hugging Face service
    const reply = await generateChatReply(messages);

    // 6. Return successful JSON reply
    return res.status(200).json({
      reply,
    });
  } catch (err) {
    console.error("Vercel /api/chat error:", err.message);
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      error: err.message || "Failed to process chat message.",
    });
  }
}
