import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS) so Vite frontend (e.g. localhost:5173) can communicate
app.use(
  cors({
    origin: "*", // Allows any origin in development
    methods: ["GET", "POST"],
  })
);

// Body parser to read JSON payloads
app.use(express.json({ limit: "1mb" }));

// Health Check Endpoint
// Frontend can call this to verify the server is running and check if HF_TOKEN is configured
app.get("/api/health", (req, res) => {
  const token = process.env.HF_TOKEN;
  const isConfigured = Boolean(token && token !== "your_huggingface_token" && token.trim() !== "");

  res.status(200).json({
    status: "ok",
    app: "StudyMate AI Backend",
    isTokenConfigured: isConfigured,
    model: process.env.HF_MODEL || "openai/gpt-oss-120b",
  });
});

// Mount chat routes under /api
app.use("/api", chatRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Global Error:", err.message);
  res.status(500).json({
    error: "Internal server error. Please try again later.",
  });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 StudyMate AI Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat API:     http://localhost:${PORT}/api/chat`);
  console.log(`========================================`);
});
