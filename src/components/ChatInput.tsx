import type { KeyboardEvent, RefObject } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  inputRef,
}: ChatInputProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="border-t border-white/10 bg-[var(--surface)] p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask anything..."
          disabled={disabled}
          className="max-h-28 min-h-10 w-full resize-y rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-70"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || value.trim().length === 0}
          className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[#0B0B0B] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send
        </button>
      </div>
      <p className="mt-1 text-[11px] text-[var(--text-muted)]">
        Enter to send, Shift+Enter for a new line.
      </p>
    </div>
  );
}
