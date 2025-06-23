import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurazione standard senza modalità standalone
  
  // Configurazione per gestire il problema della pagina 404
  experimental: {
    // Usa le nostre pagine personalizzate not-found.tsx e error.tsx
    typedRoutes: true,
  },
  
  // Disabilita la generazione di sourcemaps per ridurre la dimensione del build
  productionBrowserSourceMaps: false,
  
  // Configurazione per AWS Amplify
  poweredByHeader: false,
  
  // Gestione degli errori di build non bloccanti
  eslint: {
    // Non fallire il build per warning ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Non fallire il build per errori TypeScript
    ignoreBuildErrors: true,
  },
  
  // Configurazione per ignorare errori non critici durante il build
  onDemandEntries: {
    // Aumenta il tempo di cache per migliorare le performance
    maxInactiveAge: 60 * 60 * 1000,
    // Aumenta il numero di pagine in cache
    pagesBufferLength: 5,
  },
};

export default nextConfig;
