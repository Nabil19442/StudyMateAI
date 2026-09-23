import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Bot, User } from "lucide-react";

/**
 * Custom CodeBlock component for Markdown code snippets.
 * Displays language badge, syntax-styled dark background, and an interactive Copy button.
 */
function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code to clipboard", err);
    }
  };

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-[#2D3139] bg-[#16181D] shadow-md group">
      {/* Code block header bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#1F232B] border-b border-[#2D3139] text-xs text-gray-400 select-none">
        <span className="font-mono uppercase tracking-wider font-semibold text-[11px] text-purple-300">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2B303C] hover:bg-[#383E4D] text-gray-200 transition-all text-xs font-medium cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-300" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code block body */}
      <pre className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed text-[#E1E4E8]">
        <code>{value}</code>
      </pre>
    </div>
  );
}

/**
 * MessageBubble renders an individual message in the chat feed.
 * AI messages support full Markdown formatting, code copy, and friendly styling.
 */
export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full items-start gap-3 my-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI Avatar (Left side) */}
      {!isUser && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[#8C52FF] flex items-center justify-center text-white shadow-soft flex-shrink-0 mt-0.5">
          <Bot className="w-5 h-5" />
        </div>
      )}

      {/* Message Content Container */}
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm transition-all ${
          isUser
            ? "bg-gradient-to-br from-primary to-[#7D3FE0] text-white rounded-tr-sm shadow-primaryGlow"
            : "bg-white text-dark border border-gray-100/90 rounded-tl-sm shadow-soft"
        }`}
      >
        {/* Author Label & Time */}
        <div
          className={`flex items-center justify-between text-xs mb-1.5 font-medium ${
            isUser ? "text-purple-200" : "text-secondary"
          }`}
        >
          <span>{isUser ? "You" : "StudyMate AI"}</span>
          {message.timestamp && (
            <span className="text-[10px] opacity-75 ml-2">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        {/* Message Body */}
        {isUser ? (
          <div className="text-[14.5px] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
        ) : (
          <div className="markdown-content text-dark break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");

                  // If it's a multiline block or has a specified language, render CodeBlock
                  if (!inline && (match || codeString.includes("\n"))) {
                    return (
                      <CodeBlock
                        language={match ? match[1] : ""}
                        value={codeString}
                      />
                    );
                  }

                  // Inline code
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* User Avatar (Right side) */}
      {isUser && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1F2024] to-[#3B3D44] flex items-center justify-center text-white shadow-soft flex-shrink-0 mt-0.5">
          <User className="w-4 h-4 text-gray-200" />
        </div>
      )}
    </div>
  );
}
