import React, { useRef, useEffect } from "react";
import { Send, CornerDownLeft } from "lucide-react";

/**
 * ChatInput component handles the input field at the bottom of the screen.
 * Supports Enter to send, Shift + Enter for new lines, auto-expanding height,
 * and disabled states while the AI is responding.
 */
export default function ChatInput({ input, setInput, onSendMessage, loading }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea height as content expands
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [input]);

  // Focus input automatically on mount or when loading completes
  useEffect(() => {
    if (!loading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [loading]);

  const handleKeyDown = (e) => {
    // If Enter is pressed without Shift key, send message
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading) {
        onSendMessage();
      }
    }
  };

  const isSendDisabled = !input.trim() || loading;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-4 pt-2">
      <div className="relative flex items-end gap-2 bg-white rounded-2xl border border-gray-200/90 shadow-float p-2 sm:p-2.5 transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary-light">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your studies... (supports English, বাংলা, Banglish)"
          disabled={loading}
          className="flex-1 max-h-[140px] resize-none bg-transparent px-3 py-2 text-sm sm:text-[15px] text-dark placeholder-secondary/70 focus:outline-none leading-relaxed disabled:opacity-50"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={() => {
            if (!isSendDisabled) {
              onSendMessage();
            }
          }}
          disabled={isSendDisabled}
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all flex-shrink-0 cursor-pointer ${
            isSendDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary-hover active:bg-primary-active text-white shadow-primaryGlow hover:scale-105 active:scale-95"
          }`}
          title="Send message (Enter)"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      {/* Helper footnote below input */}
      <div className="flex items-center justify-between mt-2 px-2 text-[11px] text-secondary">
        <span className="hidden sm:inline-flex items-center gap-1">
          Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-dark font-mono text-[10px]">Enter ↵</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-dark font-mono text-[10px]">Shift + Enter</kbd> for new line
        </span>
        <span className="mx-auto sm:mx-0">
          StudyMate AI can make mistakes. Verify important academic facts.
        </span>
      </div>
    </div>
  );
}
