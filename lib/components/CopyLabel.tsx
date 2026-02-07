"use client";

import {
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type MouseEventHandler,
} from "react";

import { Copy } from "lucide-react";

import { cn, copyToClipboard } from "@/lib/utils";

interface CopyLabelProps extends ComponentPropsWithoutRef<"p"> {
  label: string;
  value: string;
  className?: string;
  copiedDurationSeconds?: number;
}

export default function CopyLabel({
  label,
  value,
  className,
  copiedDurationSeconds = 1.25,
  onClick,
  ...props
}: CopyLabelProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick: MouseEventHandler<HTMLParagraphElement> = async (
    event,
  ) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    await copyToClipboard(value);
    setIsCopied(true);
  };

  useEffect(() => {
    if (!isCopied) return;
    const timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, copiedDurationSeconds * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isCopied, copiedDurationSeconds]);

  return (
    <p
      className={cn(
        "mb-2 inline-block rounded-sm px-2 py-0.5 text-[11px] font-bold text-white hover:cursor-pointer",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {isCopied ? "Copied..." : label}
      {!isCopied && (
        <Copy
          className="ml-1 inline-block h-3 w-3 -translate-y-px align-middle"
          aria-hidden="true"
        />
      )}
    </p>
  );
}
