import React from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  Settings,
  X,
  Sparkles,
  Bot,
  GraduationCap,
} from "lucide-react";

/**
 * Sidebar component managing recent chat history, new chat creation,
 * active session selection, and mobile drawer transitions.
 */
export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenSettings,
  isOpenMobile,
  onCloseMobile,
}) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 lg:w-72 bg-white border-r border-gray-200/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Header: Brand & Mobile Close */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-[#8C52FF] flex items-center justify-center text-white shadow-soft">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-dark text-base tracking-tight">
                  StudyMate AI
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-primary-light text-primary">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-secondary">
                Your AI Study Assistant
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-secondary hover:text-dark hover:bg-gray-100 transition-colors"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-medium shadow-primaryGlow transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Recent Chats Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold tracking-wider text-secondary uppercase">
            Recent Chats
          </div>

          {sessions.length === 0 ? (
            <div className="px-3 py-8 text-center text-xs text-secondary/70">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-40" />
              No conversations yet.
              <br />
              Start asking questions!
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  className={`group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary-light text-primary font-semibold shadow-xs"
                      : "text-dark-soft hover:bg-gray-100/80"
                  }`}
                  onClick={() => {
                    onSelectSession(session.id);
                    onCloseMobile();
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? "text-primary" : "text-secondary"
                      }`}
                    />
                    <span className="truncate">{session.title || "Study Session"}</span>
                  </div>

                  {/* Delete conversation button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    type="button"
                    title="Delete chat"
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-white transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer: Settings & App Info */}
        <div className="p-3 border-t border-gray-100 space-y-1">
          <button
            onClick={onOpenSettings}
            type="button"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-dark-soft hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-secondary" />
            <span>Settings & Token Info</span>
          </button>
        </div>
      </aside>
    </>
  );
}
