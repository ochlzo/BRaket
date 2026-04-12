"use client";

import { useRef, useState } from "react";

function IdCardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm0 0H9.75"
      />
    </svg>
  );
}

type FileInputProps = {
  id: string;
  accept?: string;
  required?: boolean;
};

export function FileInput({ id, accept, required }: FileInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("No file chosen");
  const hasFile = fileName !== "No file chosen";

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]">
        <IdCardIcon />
      </div>

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        required={required}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setFileName(file?.name ?? "No file chosen");
        }}
      />

      <div className="flex h-11 items-center gap-3 rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--surface-alt)] pl-10 pr-3 text-sm">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-7 items-center rounded-md border border-[color:var(--line-strong)] bg-white px-2.5 text-xs font-semibold text-[color:var(--ink-body)] transition-colors hover:bg-[color:var(--surface-alt)] active:bg-[color:var(--line-strong)]"
        >
          Choose File
        </button>

        <span className="flex-1 truncate text-[color:var(--ink-soft)]">
          {fileName}
        </span>

        {hasFile && (
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="inline-flex h-7 items-center rounded-md border border-[color:var(--line-strong)] bg-white px-2.5 text-xs font-semibold text-[color:var(--ink-body)] transition-colors hover:bg-[color:var(--surface-alt)] active:bg-[color:var(--line-strong)]"
          >
            Preview
          </button>
        )}
      </div>
    </div>
  );
}
