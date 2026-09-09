import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

export function formatNumberArabic(num: number, locale: string): string {
  if (locale === 'ar') {
    return new Intl.NumberFormat('ar-SA').format(num);
  }
  return new Intl.NumberFormat('en-US').format(num);
}
