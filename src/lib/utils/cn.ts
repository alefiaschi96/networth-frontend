/**
 * Utility per combinare classi CSS in modo condizionale
 * Utile per l'uso con Tailwind CSS
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classi CSS usando clsx e tailwind-merge
 * 
 * @param inputs - Classi CSS da combinare
 * @returns Stringa di classi CSS combinate
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
