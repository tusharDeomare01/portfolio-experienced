import { motion } from "framer-motion";
import type { Message } from "@/store/slices/chatSlice";
import StreamingText from "./StreamingText";
import MarkdownRenderer from "./MarkdownRenderer";
import { User, Bot } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 ${
          isUser ? "items-end" : "items-start"
        } flex flex-col gap-1`}
      >
        <div
          className={`rounded-2xl px-4 py-2.5 max-w-[85%] ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-muted text-foreground rounded-bl-sm"
          }`}
        >
          {message.streaming ? (
            <StreamingText
              text={message.content}
              isStreaming={message.streaming}
            />
          ) : isUser ? (
            // User messages: plain text (no markdown needed)
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          ) : (
            // Assistant messages: render as markdown
            <MarkdownRenderer content={message.content} />
          )}
        </div>
        <span className="text-xs text-muted-foreground px-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.div>
  );
}
