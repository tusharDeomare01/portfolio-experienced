import { useMemo } from "react";
import { motion } from "framer-motion";
import MarkdownRenderer from "./MarkdownRenderer";

interface StreamingTextProps {
  text: string;
  isStreaming?: boolean;
}

export default function StreamingText({
  text,
  isStreaming = true,
}: StreamingTextProps) {
  // Use useMemo to determine if we should show markdown or plain text
  // Only render markdown when streaming is complete
  const shouldRenderMarkdown = useMemo(() => {
    return !isStreaming && text.length > 0;
  }, [isStreaming, text.length]);

  // While streaming, show plain text with cursor
  if (isStreaming) {
    return (
      <div className="text-sm whitespace-pre-wrap break-words">
        {text}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-current ml-1"
        />
      </div>
    );
  }

  // Once streaming is complete, render as markdown
  if (shouldRenderMarkdown) {
    return (
      <div className="text-sm">
        <MarkdownRenderer content={text} />
      </div>
    );
  }

  // Fallback: show plain text if no content
  return <div className="text-sm whitespace-pre-wrap break-words">{text}</div>;
}
