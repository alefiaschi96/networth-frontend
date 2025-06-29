/**
 * Servizio per la gestione dei cookie
 * 
 * Fornisce metodi per impostare, ottenere ed eliminare i cookie
 */

/**
 * Imposta un cookie
 * 
 * @param name - Nome del cookie
 * @param value - Valore del cookie
 * @param days - Durata in giorni (opzionale)
 */
export function setCookie(name: string, value: string, days?: number): void {
  let expires = '';
  
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Strict`;
}

/**
 * Ottiene il valore di un cookie
 * 
 * @param name - Nome del cookie
 * @returns Valore del cookie o null se non trovato
 */
export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
}

/**
 * Elimina un cookie
 * 
 * @param name - Nome del cookie
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict`;
}
