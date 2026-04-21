import Link from "next/link";
import type { ReactNode } from "react";

export type MessageRole = "user" | "assistant";

interface ChatMessageProps {
  role: MessageRole;
  content: string;
}

function renderInlineMarkdown(line: string): ReactNode[] {
  const tokenPattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g;
  const parts = line.split(tokenPattern).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`bold-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`code-${index}`}
          className="rounded bg-black/25 px-1 py-0.5 text-[0.92em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      return (
        <Link
          key={`link-${index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-[var(--primary)]/80 underline-offset-2 hover:text-[var(--accent-neon)]"
        >
          {label}
        </Link>
      );
    }

    return <span key={`text-${index}`}>{part}</span>;
  });
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-[var(--primary)] text-[#0B0B0B]"
            : "border border-white/10 bg-[var(--background-secondary)] text-[var(--text-secondary)]"
        }`}
      >
        {content.split("\n").map((line, lineIndex) => (
          <p key={`line-${lineIndex}`} className={lineIndex === 0 ? "" : "mt-2"}>
            {line.length > 0 ? renderInlineMarkdown(line) : <span>&nbsp;</span>}
          </p>
        ))}
      </div>
    </div>
  );
}
