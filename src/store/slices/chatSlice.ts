import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  streaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface ChatState {
  messages: Message[];
  sessions: ChatSession[];
  currentSessionId: string | null;
  isStreaming: boolean;
  isOpen: boolean;
  isFullscreen: boolean;
  error: string | null;
  showTooltip: boolean;
  lastTooltipTime: number | null;
  userInteracted: boolean;
  lastInteractivePromptTime: number | null;
  unreadCount: number;
  lastReadMessageId: string | null;
}

function generateSessionId(): string {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateSessionTitle(messages: Message[]): string {
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (firstUserMessage) {
    const title = firstUserMessage.content.slice(0, 50);
    return title.length < firstUserMessage.content.length ? `${title}...` : title;
  }
  return 'New Chat';
}

const initialState: ChatState = {
  messages: [],
  sessions: [],
  currentSessionId: null,
  isStreaming: false,
  isOpen: false,
  isFullscreen: false,
  error: null,
  showTooltip: false,
  lastTooltipTime: null,
  userInteracted: false,
  lastInteractivePromptTime: null,
  unreadCount: 0,
  lastReadMessageId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      state.error = null;
      
      // Don't increment unread count here - we'll do it in finishStreaming when message is complete
      
      // Update current session if exists
      if (state.currentSessionId) {
        const session = state.sessions.find(s => s.id === state.currentSessionId);
        if (session) {
          session.messages.push(action.payload);
          session.updatedAt = Date.now();
          if (session.messages.length === 1) {
            session.title = generateSessionTitle(session.messages);
          }
        }
      }
    },
    updateMessage: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const message = state.messages.find((msg) => msg.id === action.payload.id);
      if (message) {
        message.content += action.payload.content;
        message.streaming = true;
      }
      
      // Update in session
      if (state.currentSessionId) {
        const session = state.sessions.find(s => s.id === state.currentSessionId);
        if (session) {
          const sessionMessage = session.messages.find(m => m.id === action.payload.id);
          if (sessionMessage) {
            sessionMessage.content += action.payload.content;
            sessionMessage.streaming = true;
          }
        }
      }
    },
    finishStreaming: (state, action: PayloadAction<{ id: string }>) => {
      const message = state.messages.find((msg) => msg.id === action.payload.id);
      if (message) {
        message.streaming = false;
        // Increment unread count when streaming finishes if chat is closed
        // Only count assistant messages that have content
        if (!state.isOpen && message.role === 'assistant' && message.content && message.content.trim().length > 0) {
          // Only increment if this message wasn't already read
          const wasAlreadyRead = state.lastReadMessageId === message.id;
          if (!wasAlreadyRead) {
            state.unreadCount += 1;
          }
        }
      }
      state.isStreaming = false;
      
      // Update in session
      if (state.currentSessionId) {
        const session = state.sessions.find(s => s.id === state.currentSessionId);
        if (session) {
          const sessionMessage = session.messages.find(m => m.id === action.payload.id);
          if (sessionMessage) {
            sessionMessage.streaming = false;
          }
          session.updatedAt = Date.now();
        }
      }
    },
    setStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isStreaming = false;
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChat: (state) => {
      state.isOpen = true;
      // Reset unread count when chat opens
      state.unreadCount = 0;
      if (state.messages.length > 0) {
        state.lastReadMessageId = state.messages[state.messages.length - 1].id;
      }
      // Create new session if no current session
      if (!state.currentSessionId) {
        const newSessionId = generateSessionId();
        state.currentSessionId = newSessionId;
        state.sessions.push({
          id: newSessionId,
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen;
    },
    setFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isFullscreen = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
      
      // Clear current session messages
      if (state.currentSessionId) {
        const session = state.sessions.find(s => s.id === state.currentSessionId);
        if (session) {
          session.messages = [];
          session.title = 'New Chat';
          session.updatedAt = Date.now();
        }
      }
    },
    createNewSession: (state) => {
      const newSessionId = generateSessionId();
      state.currentSessionId = newSessionId;
      state.messages = [];
      state.error = null;
      state.sessions.push({
        id: newSessionId,
        title: 'New Chat',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    },
    switchSession: (state, action: PayloadAction<string>) => {
      const session = state.sessions.find(s => s.id === action.payload);
      if (session) {
        state.currentSessionId = session.id;
        state.messages = [...session.messages];
        state.error = null;
      }
    },
    deleteSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(s => s.id !== action.payload);
      if (state.currentSessionId === action.payload) {
        if (state.sessions.length > 0) {
          // Switch to most recent session
          const mostRecent = [...state.sessions].sort((a, b) => b.updatedAt - a.updatedAt)[0];
          state.currentSessionId = mostRecent.id;
          state.messages = [...mostRecent.messages];
        } else {
          // No sessions left, create new one
          state.currentSessionId = null;
          state.messages = [];
        }
      }
    },
    goBackToSessions: (state) => {
      // Save current messages to session before going back
      if (state.currentSessionId && state.messages.length > 0) {
        const session = state.sessions.find(s => s.id === state.currentSessionId);
        if (session) {
          session.messages = [...state.messages];
          session.updatedAt = Date.now();
        }
      }
      state.currentSessionId = null;
      state.messages = [];
    },
    showTooltip: (state) => {
      state.showTooltip = true;
      state.lastTooltipTime = Date.now();
    },
    hideTooltip: (state) => {
      state.showTooltip = false;
    },
    setUserInteracted: (state, action: PayloadAction<boolean>) => {
      state.userInteracted = action.payload;
      if (action.payload) {
        state.showTooltip = false;
      }
    },
    setLastInteractivePromptTime: (state, action: PayloadAction<number | null>) => {
      state.lastInteractivePromptTime = action.payload;
    },
    markAsRead: (state) => {
      state.unreadCount = 0;
      if (state.messages.length > 0) {
        state.lastReadMessageId = state.messages[state.messages.length - 1].id;
      }
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
  },
});

export const {
  addMessage,
  updateMessage,
  finishStreaming,
  setStreaming,
  setError,
  toggleChat,
  openChat,
  closeChat,
  toggleFullscreen,
  setFullscreen,
  clearMessages,
  createNewSession,
  switchSession,
  deleteSession,
  goBackToSessions,
  showTooltip,
  hideTooltip,
  setUserInteracted,
  setLastInteractivePromptTime,
  markAsRead,
  setUnreadCount,
} = chatSlice.actions;

export default chatSlice.reducer;
