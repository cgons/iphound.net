import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string): string {
  return str[0]?.toLocaleUpperCase() + str.slice(1);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      console.error("Failed to copy to clipboard.");
      return false;
    }
  }

  console.error("Clipboard API is not supported in this environment/browser.");
  return false;
}
