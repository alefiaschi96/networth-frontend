/**
 * Servizio API
 * 
 * Gestisce le chiamate API autenticate con gestione automatica del token
 */
import { API_CONFIG } from '@/lib/config/api';
import { authService } from './auth.service';

/**
 * Opzioni per le richieste API
 */
interface ApiRequestOptions extends RequestInit {
  authenticated?: boolean;
  skipRefreshOnFailure?: boolean;
}

/**
 * Classe per la gestione delle chiamate API
 */
class ApiService {
  /**
   * Esegue una richiesta API
   * 
   * @param endpoint - Endpoint API (senza URL base)
   * @param options - Opzioni della richiesta
   * @returns Promise con la risposta
   */
  async request<T = unknown>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { authenticated = true, skipRefreshOnFailure = false, ...fetchOptions } = options;
    
    // Costruisci l'URL completo
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    // Prepara gli headers
    const headers = new Headers(fetchOptions.headers);
    
    // Imposta il Content-Type se non specificato
    if (!headers.has('Content-Type') && !fetchOptions.body) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Aggiungi il token di autenticazione se richiesto
    if (authenticated) {
      const token = authService.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    
    // Esegui la richiesta
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });
      
      // Se la risposta è 401 (non autorizzato) e non stiamo già gestendo un refresh
      if (response.status === 401 && authenticated && !skipRefreshOnFailure) {
        // Prova a rinnovare il token
        const refreshed = await this.handleTokenRefresh();
        
        if (refreshed) {
          // Riprova la richiesta con il nuovo token
          return this.request<T>(endpoint, {
            ...options,
            skipRefreshOnFailure: true, // Evita loop infiniti
          });
        }
      }
      
      // Verifica se la risposta è OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Errore ${response.status}: ${response.statusText}`);
      }
      
      // Restituisci i dati
      return response.json();
    } catch (error) {
      console.error(`Errore durante la richiesta a ${endpoint}:`, error);
      throw error;
    }
  }
  
  /**
   * Gestisce il refresh del token
   * 
   * @returns true se il refresh è riuscito, false altrimenti
   */
  private async handleTokenRefresh(): Promise<boolean> {
    try {
      const result = await authService.refreshToken();
      return !!result;
    } catch (error) {
      console.error('Errore durante il refresh del token:', error);
      return false;
    }
  }
  
  /**
   * Esegue una richiesta GET
   * 
   * @param endpoint - Endpoint API
   * @param options - Opzioni della richiesta
   * @returns Promise con la risposta
   */
  async get<T = unknown>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }
  
  /**
   * Esegue una richiesta POST
   * 
   * @param endpoint - Endpoint API
   * @param data - Dati da inviare
   * @param options - Opzioni della richiesta
   * @returns Promise con la risposta
   */
  async post<T = unknown>(endpoint: string, data: unknown, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  /**
   * Esegue una richiesta PUT
   * 
   * @param endpoint - Endpoint API
   * @param data - Dati da inviare
   * @param options - Opzioni della richiesta
   * @returns Promise con la risposta
   */
  async put<T = unknown>(endpoint: string, data: unknown, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  /**
   * Esegue una richiesta DELETE
   * 
   * @param endpoint - Endpoint API
   * @param options - Opzioni della richiesta
   * @returns Promise con la risposta
   */
  async delete<T = unknown>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

// Esporta un'istanza singleton del servizio
export const apiService = new ApiService();
