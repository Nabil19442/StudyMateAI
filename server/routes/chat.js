import express from "express";
import { generateChatReply } from "../services/huggingface.js";

const router = express.Router();

/**
 * POST /api/chat
 * Accepts an array of conversation messages, sends them to Hugging Face,
 * and returns the AI tutor's response.
 */
router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // 1. Validation: Verify messages payload exists and is a non-empty array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Invalid request: 'messages' must be a non-empty array of message objects.",
      });
    }

    // 2. Validation: Verify that each message has a role and string content
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.content || typeof lastMessage.content !== "string" || lastMessage.content.trim() === "") {
      return res.status(400).json({
        error: "Invalid request: The last message must have non-empty text content.",
      });
    }

    // 3. Call Hugging Face service to generate reply
    const reply = await generateChatReply(messages);

    // 4. Return success response
    return res.status(200).json({
      reply,
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    // Always provide a friendly error message, never expose sensitive tokens or system details
    return res.status(statusCode).json({
      error: err.message || "An unexpected error occurred while communicating with the AI service.",
    });
  }
});

export default router;
