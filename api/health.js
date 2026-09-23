/**
 * Vercel Serverless Function for GET /api/health
 * Returns service status, model name, and whether HF_TOKEN is configured.
 */
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const token = process.env.HF_TOKEN;
  const isConfigured = Boolean(
    token &&
      token !== "your_huggingface_token" &&
      token !== "your_huggingface_token_here" &&
      token.trim() !== ""
  );

  return res.status(200).json({
    status: "ok",
    app: "StudyMate AI Backend (Vercel Serverless)",
    isTokenConfigured: isConfigured,
    model: process.env.HF_MODEL || "openai/gpt-oss-120b",
  });
}
