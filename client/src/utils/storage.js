/**
 * LocalStorage utilities for StudyMate AI
 * 
 * Provides easy helper methods to load, save, update, and delete
 * chat conversations right in the student's browser without requiring a database.
 */

const STORAGE_KEY_SESSIONS = "studymate_sessions";
const STORAGE_KEY_ACTIVE_ID = "studymate_active_session_id";

/**
 * Creates a unique ID for a session or message
 */
export function generateId() {
  return "chat_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
}

/**
 * Loads all saved chat sessions from localStorage.
 * @returns {Array<Object>} List of conversation sessions
 */
export function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to parse sessions from localStorage:", err);
    return [];
  }
}

/**
 * Saves all chat sessions to localStorage.
 * @param {Array<Object>} sessions
 */
export function saveSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error("Failed to save sessions to localStorage:", err);
  }
}

/**
 * Retrieves the currently active session ID.
 * @returns {string | null}
 */
export function getActiveSessionId() {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || null;
  } catch {
    return null;
  }
}

/**
 * Sets the currently active session ID in localStorage.
 * @param {string | null} id
 */
export function setActiveSessionId(id) {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
    }
  } catch (err) {
    console.error("Failed to set active session ID:", err);
  }
}

/**
 * Creates a fresh chat session object.
 * @param {string} [title="New Study Session"]
 * @returns {Object} New session object
 */
export function createNewSession(title = "New Study Session") {
  return {
    id: generateId(),
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  };
}

/**
 * Helper to generate a clean title from the user's first prompt.
 * Truncates nicely to ~35 characters.
 */
export function generateTitleFromMessage(content) {
  if (!content) return "New Study Session";
  const cleaned = content.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 32) return cleaned;
  return cleaned.substring(0, 32) + "...";
}
