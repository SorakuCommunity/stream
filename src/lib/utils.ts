import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinutes(minutes: number): string {
  const jam = Math.floor(minutes / 60);
  const menit = minutes % 60;
  if (jam === 0) return `${menit} menit`;
  return `${jam} jam ${menit} menit`;
}

export function formatEpisodeNumber(num: number): string {
  return `Episode ${num}`;
}
