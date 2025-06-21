/**
 * Servizio di autenticazione
 * 
 * Gestisce le operazioni di autenticazione come login, logout e gestione token
 */
import { API_CONFIG } from '@/lib/config/api';
import { jwtDecode } from 'jwt-decode';
import { setCookie, getCookie, deleteCookie } from './cookie.service';

/**
 * Interfaccia per i dati di login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interfaccia per la risposta di login
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Interfaccia per il payload del token JWT
 */
export interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  exp: number;
  iat: number;
}

/**
 * Classe per la gestione dell'autenticazione
 */
class AuthService {
  /**
   * Effettua il login con email e password
   * 
   * @param credentials - Credenziali di login (email e password)
   * @returns Risposta con token e dati utente
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante il login');
      }

      const data = await response.json();
      
      // Salva i token nei cookie e localStorage
      this.saveTokens(data.accessToken, data.refreshToken);
      
      // Salva i dati dell'utente
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Errore durante il login:', error);
      throw error;
    }
  }

  /**
   * Effettua il logout
   */
  logout(): void {
    // Rimuovi i token dai cookie
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    
    // Rimuovi i dati dal localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  /**
   * Salva i token nei cookie e nel localStorage
   * 
   * @param accessToken - Token di accesso
   * @param refreshToken - Token di refresh
   */
  saveTokens(accessToken: string, refreshToken: string): void {
    // Salva nei cookie per il middleware
    const tokenExpiry = this.getTokenExpiry(accessToken);
    const expiryDays = tokenExpiry ? (tokenExpiry - Date.now()) / (1000 * 60 * 60 * 24) : 1;
    
    setCookie('accessToken', accessToken, expiryDays);
    setCookie('refreshToken', refreshToken, 30); // Il refresh token dura di più
    
    // Salva anche nel localStorage per accesso client-side
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }
  
  /**
   * Ottiene la data di scadenza di un token JWT in millisecondi
   * 
   * @param token - Token JWT
   * @returns Data di scadenza in millisecondi o null se non valido
   */
  private getTokenExpiry(token: string): number | null {
    try {
      const decoded = this.decodeToken(token);
      return decoded.exp * 1000; // Converti da secondi a millisecondi
    } catch (error) {
      console.error('Errore nel decodificare il token:', error);
      return null;
    }
  }

  /**
   * Ottiene il token di accesso
   * 
   * @returns Token di accesso
   */
  getAccessToken(): string | null {
    // Prima prova dai cookie, poi dal localStorage
    const cookieToken = getCookie('accessToken');
    if (cookieToken) return cookieToken;
    
    // Fallback al localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    
    return null;
  }

  /**
   * Ottiene il refresh token
   * 
   * @returns Refresh token
   */
  getRefreshToken(): string | null {
    // Prima prova dai cookie, poi dal localStorage
    const cookieToken = getCookie('refreshToken');
    if (cookieToken) return cookieToken;
    
    // Fallback al localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    
    return null;
  }

  /**
   * Ottiene i dati dell'utente dal localStorage
   * 
   * @returns Dati dell'utente o null se non autenticato
   */
  getUser(): unknown | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  /**
   * Verifica se l'utente è autenticato
   * 
   * @returns true se l'utente è autenticato, false altrimenti
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      
      // Verifica se il token è scaduto
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Errore nella decodifica del token:', error);
      return false;
    }
  }
  
  /**
   * Decodifica un token JWT
   * 
   * @param token - Token JWT da decodificare
   * @returns Payload decodificato
   */
  decodeToken(token: string): JwtPayload {
    return jwtDecode<JwtPayload>(token);
  }
  
  /**
   * Verifica se il token è scaduto o sta per scadere
   * 
   * @param token - Token da verificare
   * @param thresholdSeconds - Soglia in secondi prima della scadenza (default: 60)
   * @returns true se il token è scaduto o sta per scadere, false altrimenti
   */
  isTokenExpired(token: string, thresholdSeconds = 60): boolean {
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      
      // Verifica se il token è scaduto o scadrà entro la soglia specificata
      return decoded.exp < (currentTime + thresholdSeconds);
    } catch (error) {
      console.error('Errore nella verifica della scadenza del token:', error);
      return true; // In caso di errore, considera il token come scaduto
    }
  }
  
  /**
   * Rinnova il token di accesso utilizzando il refresh token
   * 
   * @returns Promise con la risposta del refresh token
   */
  async refreshToken(): Promise<LoginResponse | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return null;
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Refresh token non valido o scaduto');
      }
      
      const data = await response.json();
      
      // Salva i nuovi token
      this.saveTokens(data.accessToken, data.refreshToken);
      
      return data;
    } catch (error) {
      console.error('Errore durante il refresh del token:', error);
      this.logout(); // Logout in caso di errore
      return null;
    }
  }
}

// Esporta un'istanza singleton del servizio
export const authService = new AuthService();
