"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mt-4 mb-2 text-foreground first:mt-0" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-semibold mt-3 mb-2 text-foreground first:mt-0" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-semibold mt-2 mb-1 text-foreground first:mt-0" {...props} />
          ),
          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="text-sm leading-relaxed mb-2 text-foreground first:mt-0 last:mb-0" {...props} />
          ),
          // Lists
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-2 space-y-1 text-sm text-foreground pl-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-2 space-y-1 text-sm text-foreground pl-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-sm text-foreground leading-relaxed" {...props} />
          ),
          // Bold and italic
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-foreground" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-foreground" {...props} />
          ),
          // Code blocks
          code: ({ node, inline, className, children, ...props }: any) => {
            // const match = /language-(\w+)/.exec(className || '');
            // const language = match ? match[1] : '';
            
            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-background/50 text-foreground text-xs font-mono border border-border/50"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className={`block p-3 rounded-lg bg-background/50 text-foreground text-xs font-mono overflow-x-auto mb-2 border border-border/50 ${className || ''}`}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, children, ...props }: any) => (
            <pre className="mb-2 overflow-x-auto rounded-lg" {...props}>
              {children}
            </pre>
          ),
          // Links
          a: ({ node, ...props }) => (
            <a
              className="text-primary underline hover:text-primary/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary/50 pl-4 italic my-2 text-muted-foreground bg-background/30 rounded-r"
              {...props}
            />
          ),
          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="my-3 border-border" {...props} />
          ),
          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border-collapse border border-border rounded" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-muted/50" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="border-b border-border hover:bg-muted/30 transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-border px-3 py-2 text-left font-semibold text-sm text-foreground" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-border px-3 py-2 text-sm text-foreground" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

