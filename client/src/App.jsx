import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import SettingsModal from "./components/SettingsModal";
import {
  loadSessions,
  saveSessions,
  getActiveSessionId,
  setActiveSessionId,
  createNewSession,
  generateTitleFromMessage,
} from "./utils/storage";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 1. Initial Load: Retrieve sessions from localStorage
  useEffect(() => {
    const savedSessions = loadSessions();
    const savedActiveId = getActiveSessionId();

    if (savedSessions.length > 0) {
      setSessions(savedSessions);
      // Ensure saved active ID exists in sessions list
      const sessionExists = savedSessions.some((s) => s.id === savedActiveId);
      if (sessionExists) {
        setActiveId(savedActiveId);
      } else {
        setActiveId(savedSessions[0].id);
        setActiveSessionId(savedSessions[0].id);
      }
    } else {
      // First time user: create an initial session
      const freshSession = createNewSession("New Study Session");
      setSessions([freshSession]);
      setActiveId(freshSession.id);
      saveSessions([freshSession]);
      setActiveSessionId(freshSession.id);
    }
  }, []);

  // Retrieve current active session object
  const currentSession =
    sessions.find((s) => s.id === activeSessionId) ||
    sessions[0] ||
    createNewSession("New Study Session");

  // Handler: Switch conversation session
  const handleSelectSession = (id) => {
    setActiveId(id);
    setActiveSessionId(id);
    setErrorMessage("");
  };

  // Handler: Start a brand new chat session
  const handleNewChat = () => {
    // If the current session is already empty, just stay on it
    if (currentSession && currentSession.messages.length === 0) {
      return;
    }
    const newSession = createNewSession("New Study Session");
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveId(newSession.id);
    saveSessions(updated);
    setActiveSessionId(newSession.id);
    setErrorMessage("");
    setInput("");
  };

  // Handler: Delete a session
  const handleDeleteSession = (idToDelete) => {
    const updated = sessions.filter((s) => s.id !== idToDelete);
    saveSessions(updated);
    setSessions(updated);

    if (activeSessionId === idToDelete) {
      if (updated.length > 0) {
        setActiveId(updated[0].id);
        setActiveSessionId(updated[0].id);
      } else {
        const fresh = createNewSession("New Study Session");
        setSessions([fresh]);
        setActiveId(fresh.id);
        saveSessions([fresh]);
        setActiveSessionId(fresh.id);
      }
    }
  };

  // Handler: Reset/clear all conversations
  const handleClearAllChats = () => {
    const fresh = createNewSession("New Study Session");
    setSessions([fresh]);
    setActiveId(fresh.id);
    saveSessions([fresh]);
    setActiveSessionId(fresh.id);
    setErrorMessage("");
  };

  // Handler: Dispatch message to backend API
  const handleSendMessage = async (customPrompt) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    setErrorMessage("");

    // Prepare user message
    const userMessage = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    // Determine current messages and whether to update session title
    const currentMessages = currentSession.messages || [];
    const isFirstMessage = currentMessages.length === 0;
    const newTitle = isFirstMessage
      ? generateTitleFromMessage(textToSend)
      : currentSession.title;

    const updatedMessages = [...currentMessages, userMessage];

    // Update active session locally
    const updatedSessions = sessions.map((s) => {
      if (s.id === currentSession.id) {
        return {
          ...s,
          title: newTitle,
          updatedAt: new Date().toISOString(),
          messages: updatedMessages,
        };
      }
      return s;
    });

    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    setInput("");
    setLoading(true);

    try {
      // Send conversation history to backend Express API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to receive response from StudyMate AI backend."
        );
      }

      // Append AI response
      const aiMessage = {
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      const finalizedSessions = updatedSessions.map((s) => {
        if (s.id === currentSession.id) {
          return {
            ...s,
            updatedAt: new Date().toISOString(),
            messages: finalMessages,
          };
        }
        return s;
      });

      setSessions(finalizedSessions);
      saveSessions(finalizedSessions);
    } catch (err) {
      console.error("Chat Error:", err);
      setErrorMessage(
        err.message || "Something went wrong. Please check your network or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F8FA] font-sans antialiased text-dark">
      {/* Sidebar with Chat History */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        <ChatWindow
          session={currentSession}
          messages={currentSession.messages || []}
          input={input}
          setInput={setInput}
          onSendMessage={() => handleSendMessage()}
          onSelectPrompt={(prompt) => handleSendMessage(prompt)}
          loading={loading}
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage("")}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />
      </main>

      {/* Settings & Token Status Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearAllChats={handleClearAllChats}
      />
    </div>
  );
}
