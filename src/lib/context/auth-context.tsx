"use client";

/**
 * Contesto di autenticazione
 * 
 * Gestisce lo stato di autenticazione dell'utente e fornisce metodi per login, logout e refresh token
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, LoginCredentials } from '@/lib/services/auth.service';
import { API_CONFIG } from '@/lib/config/api';

/**
 * Interfaccia per i dati dell'utente
 */
export interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * Interfaccia per il contesto di autenticazione
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Creazione del contesto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider del contesto di autenticazione
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Verifica lo stato di autenticazione all'avvio
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getAccessToken();
        
        if (token) {
          // Verifica se il token è valido
          try {
            // Recupera i dati dell'utente
            const userData = await fetchUserData(token);
            setUser(userData);
          } catch (error) {
            console.error('Errore durante il recupero dei dati dell\'utente:', error);
            // Se il token è scaduto, prova a rinnovarlo
            try {
              const refreshToken = localStorage.getItem('refreshToken');
              if (refreshToken) {
                await refreshAccessToken(refreshToken);
                // Dopo il refresh, recupera i dati dell'utente
                const userData = await fetchUserData(authService.getAccessToken() || '');
                setUser(userData);
              } else {
                // Nessun refresh token disponibile, logout
                handleLogout();
              }
            } catch (refreshError) {
              console.error('Errore durante il refresh del token:', refreshError);
              // Errore nel refresh, logout
              handleLogout();
            }
          }
        }
      } catch (error) {
        console.error('Errore durante il controllo dell\'autenticazione:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  /**
   * Recupera i dati dell'utente dal server
   */
  const fetchUserData = async (token: string): Promise<User> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER.PROFILE}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token non valido o scaduto');
    }

    return await response.json();
  };

  /**
   * Rinnova il token di accesso utilizzando il refresh token
   */
  const refreshAccessToken = async (refreshToken: string): Promise<void> => {
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
      authService.saveTokens(data.accessToken, data.refreshToken);
    } catch (error) {
      console.error('Errore durante il refresh del token:', error);
      throw error;
    }
  };

  /**
   * Effettua il login
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Errore durante il login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Effettua il logout
   */
  const handleLogout = (): void => {
    authService.logout();
    setUser(null);
    router.push('/auth/login');
  };

  /**
   * Pulisce gli errori
   */
  const clearError = (): void => {
    setError(null);
  };

  // Valore del contesto
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout: handleLogout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personalizzato per utilizzare il contesto di autenticazione
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve essere utilizzato all\'interno di un AuthProvider');
  }
  
  return context;
}
