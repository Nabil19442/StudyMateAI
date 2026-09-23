import React, { useRef, useEffect } from "react";
import { Menu, Sparkles, Bot, AlertTriangle, ShieldCheck } from "lucide-react";
import MessageBubble from "./MessageBubble";
import WelcomeScreen from "./WelcomeScreen";
import ChatInput from "./ChatInput";
import ThinkingIndicator from "./ThinkingIndicator";

/**
 * ChatWindow is the main conversation viewport.
 * Coordinates the header, scrollable messages stream, welcome state,
 * thinking indicator, error alerts, and bottom input.
 */
export default function ChatWindow({
  session,
  messages,
  input,
  setInput,
  onSendMessage,
  onSelectPrompt,
  loading,
  errorMessage,
  onClearError,
  onOpenMobileSidebar,
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom whenever messages change or loading state toggles
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-[#F8F8FA] relative">
      {/* Header Bar */}
      <header className="h-16 px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={onOpenMobileSidebar}
            type="button"
            className="md:hidden p-2 rounded-xl text-dark-soft hover:bg-gray-100 transition-colors"
            title="Open chats"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* App Title & Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-[#8C52FF] flex items-center justify-center text-white shadow-soft">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-dark tracking-tight leading-tight">
                  StudyMate AI
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Tutor
                </span>
              </div>
              <p className="text-xs text-secondary font-medium">
                AI Study Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Right Header Status / Language badges */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-secondary bg-gray-50 border border-gray-200/70 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>English • বাংলা • Banglish</span>
          </div>
        </div>
      </header>

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="mx-4 sm:mx-6 mt-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-xs animate-fade-in z-10 flex-shrink-0">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Notice:</span> {errorMessage}
            </div>
          </div>
          <button
            onClick={onClearError}
            type="button"
            className="text-rose-600 hover:text-rose-900 font-bold px-1.5 py-0.5 rounded text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        {messages.length === 0 ? (
          <WelcomeScreen onSelectPrompt={onSelectPrompt} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-2">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}

            {loading && <ThinkingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Docked Chat Input */}
      <div className="flex-shrink-0 bg-gradient-to-t from-[#F8F8FA] via-[#F8F8FA] to-transparent pt-2">
        <ChatInput
          input={input}
          setInput={setInput}
          onSendMessage={onSendMessage}
          loading={loading}
        />
      </div>
    </div>
  );
}
