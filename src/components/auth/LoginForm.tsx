"use client";

/**
 * Componente LoginForm
 * 
 * Form di login per l'autenticazione degli utenti
 */
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/context/auth-context';
import type { LoginCredentials } from '@/lib/services/auth.service';

/**
 * Form di login con gestione dello stato e validazione base
 */
export default function LoginForm() {
  // Utilizziamo il contesto di autenticazione
  const { login, error: authError, isLoading, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState<string | null>(authError);
  
  /**
   * Gestisce i cambiamenti nei campi del form
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Rimuovi l'errore quando l'utente inizia a correggere
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  /**
   * Valida il form e restituisce true se è valido
   */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email obbligatoria';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password obbligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Gestisce l'invio del form
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoginError(null);
      clearError();
      
      try {
        const credentials: LoginCredentials = {
          email: formData.email,
          password: formData.password
        };
        
        // Utilizziamo il metodo login dal contesto di autenticazione
        // che gestirà automaticamente il redirect alla dashboard
        await login(credentials);
        
      } catch (error) {
        console.error('Errore durante il login:', error);
        setLoginError(error instanceof Error ? error.message : 'Errore durante il login. Verifica le tue credenziali.');
      }
    }
  };
  
  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Accedi a NetWorth</h1>
        <p className="text-muted-foreground mt-2">
          Inserisci le tue credenziali per accedere
        </p>
        
        {(loginError || authError) && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-md text-sm">
            {loginError || authError}
          </div>
        )}
      </div>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.email ? 'border-destructive' : 'border-input'
            }`}
            placeholder="nome@esempio.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email}</p>
          )}
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
              Password dimenticata?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.password ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-destructive">{errors.password}</p>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm">
            Ricordami
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Accesso in corso...' : 'Accedi'}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p>
          Non hai un account?{' '}
          <Link href="/auth/register" className="text-primary hover:underline font-medium">
            Registrati
          </Link>
        </p>
      </div>
    </div>
  );
}
