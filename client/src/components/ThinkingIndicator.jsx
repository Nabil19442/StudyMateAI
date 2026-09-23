import React from "react";
import { Bot } from "lucide-react";

/**
 * Animated thinking indicator shown while waiting for Hugging Face model response.
 */
export default function ThinkingIndicator() {
  return (
    <div className="flex w-full items-start gap-3 my-4 justify-start animate-fade-in">
      {/* Bot Avatar */}
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[#8C52FF] flex items-center justify-center text-white shadow-soft flex-shrink-0 mt-0.5">
        <Bot className="w-5 h-5 animate-pulse" />
      </div>

      {/* Bubble with bouncing dots */}
      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-soft flex items-center gap-3">
        <span className="text-sm font-medium text-dark-soft">
          StudyMate is thinking
        </span>
        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
        </div>
      </div>
    </div>
  );
}
