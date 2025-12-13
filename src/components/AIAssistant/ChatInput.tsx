"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Send, Loader2 } from "lucide-react";
import { sendMessage } from "./useChat";
import { store } from "@/store/store";
import { Textarea } from "../lightswind/textarea";
import { Button } from "../lightswind/button";

export default function ChatInput() {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState("");
  const isStreaming = useAppSelector((state) => state.chat.isStreaming);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const message = input.trim();
    setInput("");
    await sendMessage(message, dispatch, () => store.getState());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything about Tushar..."
        className="min-h-[50px] sm:min-h-[60px] max-h-[120px] resize-none text-sm sm:text-base"
        disabled={isStreaming}
      />
      <Button
        onClick={handleSend}
        disabled={!input.trim() || isStreaming}
        size="icon"
        className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] shrink-0 touch-manipulation"
      >
        {isStreaming ? (
          <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
        ) : (
          <Send className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </Button>
    </div>
  );
}
