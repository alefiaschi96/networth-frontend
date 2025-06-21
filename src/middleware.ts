/**
 * Middleware per la gestione dell'autenticazione
 * 
 * Protegge le rotte autenticate e gestisce il redirect per gli utenti non autenticati
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Percorsi pubblici che non richiedono autenticazione
const publicPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/',
];

// Percorsi statici che devono essere esclusi dal middleware
const staticPaths = [
  '/_next',
  '/favicon.ico',
  '/images',
  '/api',
];

/**
 * Verifica se un percorso è pubblico
 * 
 * @param path - Percorso da verificare
 * @returns true se il percorso è pubblico, false altrimenti
 */
function isPublicPath(path: string): boolean {
  return publicPaths.some(publicPath => path === publicPath || path.startsWith(`${publicPath}/`));
}

/**
 * Verifica se un percorso è statico
 * 
 * @param path - Percorso da verificare
 * @returns true se il percorso è statico, false altrimenti
 */
function isStaticPath(path: string): boolean {
  return staticPaths.some(staticPath => path.startsWith(staticPath));
}

/**
 * Middleware di autenticazione
 * 
 * Verifica se l'utente è autenticato per accedere alle rotte protette
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignora i percorsi statici
  if (isStaticPath(pathname)) {
    return NextResponse.next();
  }
  
  // Se il percorso è pubblico, consenti l'accesso
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // Verifica se l'utente è autenticato
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // Se non c'è un token, reindirizza alla pagina di login
  if (!accessToken) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // Altrimenti, consenti l'accesso
  return NextResponse.next();
}

/**
 * Configura i percorsi su cui eseguire il middleware
 */
export const config = {
  // Specifica esattamente quali percorsi devono essere protetti
  matcher: [
    /*
     * Corrispondenza con tutte le rotte richieste eccetto quelle statiche o pubbliche
     * - '/((?!_next/static|_next/image|favicon.ico).*)' corrisponde a tutte le rotte tranne quelle statiche
     * - '/(dashboard|profile|settings|accounts|transactions)/:path*' corrisponde a tutte le rotte autenticate
     */
    '/(dashboard|profile|settings|accounts|transactions)/:path*'
  ],
};
