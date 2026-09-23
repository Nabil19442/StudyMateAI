import React, { useState, useEffect } from "react";
import { X, Key, Server, Cpu, Trash2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

/**
 * SettingsModal provides helpful system status and beginner guidance.
 * Shows whether the server is reachable and if HF_TOKEN is configured.
 */
export default function SettingsModal({ isOpen, onClose, onClearAllChats }) {
  const [serverInfo, setServerInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      fetch(`${API_BASE_URL}/api/health`)
        .then(async (res) => {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            return res.json();
          }
          throw new Error(`Non-JSON response (HTTP ${res.status})`);
        })
        .then((data) => {
          setServerInfo(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Health check failed:", err);
          setServerInfo({ status: "offline" });
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-dark">Settings & AI Status</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-dark hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Backend Status Card */}
          <div className="p-3.5 rounded-xl bg-[#F8F8FA] border border-gray-200/80 space-y-2">
            <div className="flex items-center justify-between font-medium">
              <span className="text-secondary flex items-center gap-1.5">
                <Server className="w-4 h-4" /> Backend Server
              </span>
              {loading ? (
                <span className="text-secondary">Checking...</span>
              ) : serverInfo?.status === "ok" ? (
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Online (Port 5000)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> Offline
                </span>
              )}
            </div>

            {/* Hugging Face Token Status */}
            <div className="flex items-center justify-between font-medium pt-1 border-t border-gray-200/60">
              <span className="text-secondary flex items-center gap-1.5">
                <Key className="w-4 h-4" /> Hugging Face Token
              </span>
              {loading ? (
                <span className="text-secondary">Checking...</span>
              ) : serverInfo?.isTokenConfigured ? (
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-500 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> Not Configured
                </span>
              )}
            </div>

            {/* Model in use */}
            <div className="flex items-center justify-between font-medium pt-1 border-t border-gray-200/60">
              <span className="text-secondary flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> AI Model
              </span>
              <span className="font-mono text-[11px] text-primary font-semibold">
                {serverInfo?.model || "openai/gpt-oss-120b"}
              </span>
            </div>
          </div>

          {/* Setup Advice */}
          <div className="p-3.5 rounded-xl bg-primary-light/60 border border-primary-border space-y-1.5 text-xs text-dark leading-relaxed">
            <div className="font-semibold text-primary flex items-center gap-1">
              🔑 How to add your Hugging Face Token:
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-dark-soft">
              <li>
                Create a free token at{" "}
                <a
                  href="https://huggingface.co/settings/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline font-medium inline-flex items-center gap-0.5"
                >
                  huggingface.co/settings/tokens <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <strong>Local Dev:</strong> Add to <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-mono text-[11px]">server/.env</code> as <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-mono text-[11px]">HF_TOKEN=hf_...</code>
              </li>
              <li>
                <strong>Vercel Production:</strong> Add <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-mono text-[11px]">HF_TOKEN</code> in your Vercel Dashboard under <em>Settings &gt; Environment Variables</em>.
              </li>
            </ol>
          </div>

          {/* Clear local storage */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-secondary">Reset all saved chats:</span>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete all saved conversations?")) {
                  onClearAllChats();
                  onClose();
                }
              }}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
