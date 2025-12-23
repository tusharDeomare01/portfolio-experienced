import type { AppDispatch, RootState } from "@/store/store";
import {
  addMessage,
  updateMessage,
  finishStreaming,
  setStreaming,
  setError,
} from "@/store/slices/chatSlice";
import { streamChatCompletion } from "@/lib/openai";
import type { ChatMessage } from "@/lib/openai";
import { playResponseNotificationSound } from "@/lib/audioUtils";
import { showBrowserNotification, getNotificationPreferences } from "@/lib/notificationUtils";

function generateId(): string {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function sendMessage(
  content: string,
  dispatch: AppDispatch,
  getState: () => RootState,
  signal?: AbortSignal
) {
  if (!content.trim()) return;

  const userMessageId = generateId();
  const assistantMessageId = generateId();

  // Add user message
  dispatch(
    addMessage({
      id: userMessageId,
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    })
  );

  // Add assistant message placeholder
  dispatch(
    addMessage({
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      streaming: true,
    })
  );

  dispatch(setStreaming(true));
  dispatch(setError(null));

  try {
    // Get current messages for context
    const state = getState();
    const allMessages = state.chat.messages;

    // Convert to OpenAI format (excluding the current streaming message)
    const chatMessages: ChatMessage[] = allMessages
      .filter((msg) => msg.id !== assistantMessageId)
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    // Stream response with AbortController support
    for await (const chunk of streamChatCompletion(chatMessages, signal)) {
      // Check if request was aborted
      if (signal?.aborted) {
        return;
      }
      dispatch(
        updateMessage({
          id: assistantMessageId,
          content: chunk,
        })
      );
    }

    // Finish streaming
    dispatch(finishStreaming({ id: assistantMessageId }));
    
    // Trigger notifications if chat is closed
    // Get fresh state after streaming completes
    const currentState = getState();
    if (!currentState.chat.isOpen) {
      const prefs = getNotificationPreferences();
      
      // Get the final message content for notification
      const finalMessage = currentState.chat.messages.find(m => m.id === assistantMessageId);
      const messagePreview = finalMessage?.content 
        ? finalMessage.content.slice(0, 100) + (finalMessage.content.length > 100 ? '...' : '')
        : "You have a new message";
      
      // Play sound notification
      if (prefs.soundEnabled) {
        playResponseNotificationSound().catch(() => {
          // Silently fail if sound cannot play
        });
      }
      
      // Show browser notification
      if (prefs.browserNotifications) {
        showBrowserNotification("AI Assistant - New Message", {
          body: messagePreview,
          icon: "/vite.svg",
        }).catch(() => {
          // Silently fail if notification cannot be shown
        });
      }
      
      // Page title will be updated by the unread count change in the reducer
    }
  } catch (error: any) {
    // Log error in development, handle silently in production
    if (import.meta.env.DEV) {
      console.error("Error sending message:", error);
    }
    dispatch(
      setError(
        error.message || "Failed to get response. Please try again."
      )
    );
    dispatch(finishStreaming({ id: assistantMessageId }));
    
    // Update the failed assistant message
    dispatch(
      updateMessage({
        id: assistantMessageId,
        content: "Sorry, I encountered an error. Please try again.",
      })
    );
  }
}
