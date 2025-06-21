/**
 * Layout principale dell'applicazione NetWorth
 * 
 * Configura il tema, i font e le impostazioni globali dell'applicazione
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/lib/context/auth-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | NetWorth",
    default: "NetWorth - Gestione Patrimonio Personale",
  },
  description: "Monitora e gestisci il tuo patrimonio personale in modo semplice ed efficace",
  keywords: ["finanza personale", "patrimonio", "investimenti", "asset", "conti bancari", "dashboard finanziaria"],
  authors: [{ name: "Alessandro Fiaschi" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans antialiased min-h-screen`}
        style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
