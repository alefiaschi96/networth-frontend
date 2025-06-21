/**
 * Provider per la gestione del tema dell'applicazione
 * 
 * Utilizza next-themes per gestire il tema chiaro/scuro e le preferenze dell'utente
 */
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider che avvolge l'applicazione per gestire il tema
 * 
 * @param children - Componenti figli
 * @param props - Proprietà per il provider del tema
 */
export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: unknown;
}) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
