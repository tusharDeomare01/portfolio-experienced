import { useEffect, useRef, useState } from "react";
import { motion, DragControls } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import {
  X,
  Maximize2,
  Minimize2,
  Trash2,
  ArrowLeft,
  Plus,
  GripVertical,
} from "lucide-react";
import {
  closeChat,
  toggleFullscreen,
  clearMessages,
  goBackToSessions,
  createNewSession,
  switchSession,
  addMessage,
  setLastInteractivePromptTime,
  markAsRead,
} from "@/store/slices/chatSlice";
import SuggestedQuestions from "./SuggestedQuestions";
import { playSubtleNotificationSound } from "@/lib/audioUtils";
import { resetPageTitle } from "@/lib/notificationUtils";
import { Card } from "../lightswind/card";
import { Button } from "../lightswind/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../lightswind/dialog";
import { ScrollArea } from "../lightswind/scroll-area";

interface ChatInterfaceProps {
  isFullscreen: boolean;
  dragEnabled?: boolean;
  dragControls?: DragControls;
}

export default function ChatInterface({
  isFullscreen,
  dragEnabled = false,
  dragControls,
}: ChatInterfaceProps) {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.chat.messages);
  const sessions = useAppSelector((state) => state.chat.sessions);
  const currentSessionId = useAppSelector(
    (state) => state.chat.currentSessionId
  );
  const isStreaming = useAppSelector((state) => state.chat.isStreaming);
  const error = useAppSelector((state) => state.chat.error);
  const lastInteractivePromptTime = useAppSelector(
    (state) => state.chat.lastInteractivePromptTime
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const interactivePromptShownRef = useRef(false);

  // Interactive prompts that appear if user ignored tooltip
  const interactivePrompts = [
    "👋 Hey there! I'm here to help you learn about Tushar. Want to know about his projects or experience?",
    "💡 Curious about Tushar's skills? I can tell you about his technical expertise and achievements!",
    "🚀 Ask me anything! I know all about Tushar's work, education, and career journey.",
    "✨ I'm Tushar's AI assistant! What would you like to know about him today?",
  ];

  // Prevent scroll propagation to main app
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector(
      '[class*="overflow"]'
    ) as HTMLElement;
    if (scrollContainer) {
      const handleWheel = (e: Event) => {
        const wheelEvent = e as WheelEvent;
        wheelEvent.stopPropagation();
      };
      const handleTouchMove = (e: Event) => {
        const touchEvent = e as TouchEvent;
        touchEvent.stopPropagation();
      };

      scrollContainer.addEventListener("wheel", handleWheel, {
        passive: false,
      });
      scrollContainer.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });

      return () => {
        scrollContainer.removeEventListener("wheel", handleWheel);
        scrollContainer.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, []); // Empty dependency array - only set up once

  // Auto-scroll to bottom when new messages arrive or streaming updates
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    // Mark messages as read when chat is open and user is viewing
    if (messages.length > 0 && !isStreaming) {
      dispatch(markAsRead());
      resetPageTitle();
    }
  }, [messages.length, isStreaming, dispatch]); // Only depend on length, not entire messages array

  // Show interactive prompt if user ignored tooltip
  useEffect(() => {
    if (
      messages.length === 0 &&
      lastInteractivePromptTime &&
      !interactivePromptShownRef.current &&
      !isStreaming
    ) {
      const delayBeforePrompt = 2000; // 2 seconds after chat opens

      const timer = setTimeout(() => {
        if (messages.length === 0) {
          // Select a random interactive prompt
          const randomPrompt =
            interactivePrompts[
              Math.floor(Math.random() * interactivePrompts.length)
            ];

          // Play subtle notification sound
          playSubtleNotificationSound().catch(() => {
            // Silently fail if sound cannot play
          });

          // Add the interactive message
          dispatch(
            addMessage({
              id: `interactive-${Date.now()}`,
              role: "assistant",
              content: randomPrompt,
              timestamp: Date.now(),
            })
          );

          interactivePromptShownRef.current = true;
          dispatch(setLastInteractivePromptTime(null));
        }
      }, delayBeforePrompt);

      return () => clearTimeout(timer);
    }
  }, [
    lastInteractivePromptTime,
    messages.length,
    isStreaming,
    dispatch,
    interactivePrompts,
  ]);

  // Reset interactive prompt flag when messages are cleared
  useEffect(() => {
    if (messages.length === 0) {
      interactivePromptShownRef.current = false;
    }
  }, [messages.length]);

  const handleClose = () => {
    dispatch(closeChat());
  };

  const handleToggleFullscreen = () => {
    dispatch(toggleFullscreen());
  };

  const handleClearChat = () => {
    dispatch(clearMessages());
    setShowClearDialog(false);
  };

  const handleBackToSessions = () => {
    dispatch(goBackToSessions());
    setShowSessions(true);
  };

  const handleNewChat = () => {
    dispatch(createNewSession());
    setShowSessions(false);
  };

  const handleSelectSession = (sessionId: string) => {
    dispatch(switchSession(sessionId));
    setShowSessions(false);
  };

  // Prevent drag when clicking buttons
  const handleButtonClick = (e: React.MouseEvent, handler: () => void) => {
    e.stopPropagation();
    handler();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full w-full"
    >
      <Card className="flex flex-col h-full backdrop-blur-xl bg-background/95 border-2 shadow-2xl overflow-hidden">
        {/* Header - Drag Handle Area */}
        <div
          onPointerDown={(e) => {
            if (dragEnabled && dragControls && !isFullscreen) {
              // Only allow drag to start from header area, not from buttons
              const target = e.target as HTMLElement;
              const isButton = target.closest("button") !== null;
              if (!isButton) {
                e.preventDefault();
                e.stopPropagation();
                dragControls.start(e);
              }
            }
          }}
          onTouchStart={(e) => {
            if (dragEnabled && dragControls && !isFullscreen) {
              const target = e.target as HTMLElement;
              const isButton = target.closest("button") !== null;
              if (!isButton) {
                e.stopPropagation();
              }
            }
          }}
          className={`flex items-center justify-between p-3 sm:p-4 border-b border-border ${
            dragEnabled && !isFullscreen
              ? "cursor-grab active:cursor-grabbing select-none"
              : ""
          }`}
          style={{
            touchAction: dragEnabled && !isFullscreen ? "none" : "auto",
          }}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
            {dragEnabled && !isFullscreen && (
              <div className="text-muted-foreground opacity-50 hidden sm:block">
                <GripVertical className="h-4 w-4" />
              </div>
            )}
            {sessions.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleButtonClick(e, handleBackToSessions)}
                className="h-8 w-8 p-0 touch-manipulation"
                title="Back to chats"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
              AI Assistant
            </h3>
            {sessions.length > 1 && (
              <span className="text-xs text-muted-foreground hidden sm:inline">
                ({sessions.length} chats)
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-1 sm:gap-2 flex-shrink-0"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {messages.length > 0 && (
              <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 touch-manipulation"
                    title="Clear chat"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Clear Chat</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to clear all messages in this chat?
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowClearDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleClearChat}>
                      Clear Chat
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleButtonClick(e, handleToggleFullscreen)}
              className="h-8 w-8 p-0 touch-manipulation"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleButtonClick(e, handleClose)}
              className="h-8 w-8 p-0 touch-manipulation"
              title="Close"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sessions List */}
        {showSessions && sessions.length > 0 && (
          <div className="flex-1 overflow-y-auto p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">Chat History</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewChat}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
            </div>
            <div className="space-y-2">
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    currentSessionId === session.id
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => handleSelectSession(session.id)}
                >
                  <p className="font-medium text-sm text-foreground truncate">
                    {session.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {session.messages.length} messages •{" "}
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 sm:p-4">
          <div
            className="space-y-3 sm:space-y-4"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] sm:min-h-[400px] text-center px-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3 sm:space-y-4 w-full max-w-md"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                      Hi! I'm Tushar's AI Assistant
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      Ask me anything about Tushar.
                    </p>
                  </div>
                  <SuggestedQuestions />
                </motion.div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}

                {isStreaming && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                    <span className="text-xs">AI is thinking...</span>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mb-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
          >
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-border">
          <ChatInput />
        </div>
      </Card>
    </motion.div>
  );
}
