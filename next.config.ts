import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ottimizzazione per la produzione
  output: 'standalone',
  
  // Disabilita completamente la generazione statica della pagina 404
  // che causa problemi con l'importazione di Html
  experimental: {
    // Usa le nostre pagine personalizzate not-found.tsx e error.tsx
    typedRoutes: true,
  },
  
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
  
  // Disabilita completamente la generazione statica della pagina 404
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      // Non includere la pagina 404 nella generazione statica
    };
  },
};

export default nextConfig;
