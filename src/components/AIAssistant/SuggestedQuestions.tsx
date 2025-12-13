"use client";

import { motion } from "framer-motion";
import { SUGGESTED_QUESTIONS } from "@/lib/prompts";
import { useAppDispatch } from "@/store/hooks";
import { sendMessage } from "./useChat";
import { store } from "@/store/store";
import { Button } from "../lightswind/button";

export default function SuggestedQuestions() {
  const dispatch = useAppDispatch();

  const handleQuestionClick = async (question: string) => {
    await sendMessage(question, dispatch, () => store.getState());
  };

  return (
    <div className="space-y-2 w-full">
      <p className="text-xs text-muted-foreground mb-2 sm:mb-3">
        Suggested questions:
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.slice(0, 4).map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-1 min-w-[calc(50%-0.25rem)] sm:flex-none"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuestionClick(question)}
              className="text-xs h-auto py-2 px-2 sm:px-3 whitespace-normal text-left w-full sm:w-auto touch-manipulation"
            >
              {question}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
