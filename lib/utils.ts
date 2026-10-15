import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string | null | undefined): string {
  if (!price) return "";
  const num = Number(price);
  return isNaN(num) ? String(price) : num.toLocaleString("en-IN");
}

export function formatDimension(size: string | null | undefined): string {
  if (!size) return "";
  const clean = size
    .replaceAll('"', '')
    .replace(/inches/i, '')
    .replace(/inch/i, '')
    .trim();

  return clean ? `${clean} Inches` : "";
}