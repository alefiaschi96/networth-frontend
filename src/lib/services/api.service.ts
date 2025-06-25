/**
 * Servizio API
 *
 * Gestisce le chiamate API autenticate con gestione automatica del token
 */
import { API_CONFIG } from "@/lib/config/api";
import { authService } from "./auth.service";

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
  async request<T = unknown>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      authenticated = true,
      skipRefreshOnFailure = false,
      ...fetchOptions
    } = options;

    // Costruisci l'URL completo
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    // Prepara gli headers
    const headers = new Headers(fetchOptions.headers);

    // Imposta il Content-Type se non specificato
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    // Aggiungi il token di autenticazione se richiesto
    if (authenticated) {
      const token = authService.getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
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

      // Clona la risposta per poterla leggere due volte
      const clonedResponse = response.clone();

      // Prova a leggere il corpo della risposta come testo
      const responseText = await clonedResponse.text();

      // Verifica se la risposta è OK
      if (!response.ok) {
        // Definiamo un'interfaccia per i dati di errore
        interface ErrorResponse {
          message?: string | string[];
          error?: string;
          statusCode?: number;
        }
        
        let errorData: ErrorResponse = {};
        try {
          // Prova a parsare il testo come JSON
          errorData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
          console.error('Errore nel parsing della risposta JSON:', e);
        }
        
        // Gestione del messaggio di errore che può essere una stringa o un array di stringhe
        let errorMessage: string;
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('\n');
        } else if (typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        } else {
          errorMessage = `Errore ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      try {
        if (!responseText) {
          return {} as T;
        }
        return JSON.parse(responseText) as T;
      } catch (e) {
        console.error("Errore nel parsing della risposta JSON:", e);
        throw new Error("Errore nel parsing della risposta JSON");
      }
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
      console.error("Errore durante il refresh del token:", error);
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
  async get<T = unknown>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
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
  async post<T = unknown>(
    endpoint: string,
    data: unknown,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
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
  async put<T = unknown>(
    endpoint: string,
    data: unknown,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
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
  async delete<T = unknown>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
  
  /**
   * Esegue una richiesta HEAD
   * Utile per verificare l'esistenza di una risorsa senza recuperarne il contenuto
   *
   * @param endpoint - Endpoint API
   * @param options - Opzioni della richiesta
   * @returns Promise con la risposta (tipicamente vuota)
   */
  async head<T = unknown>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "HEAD",
    });
  }
}

// Esporta un'istanza singleton del servizio
export const apiService = new ApiService();
