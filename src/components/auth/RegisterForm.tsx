"use client";

/**
 * Componente RegisterForm
 * 
 * Form di registrazione per nuovi utenti
 */
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

/**
 * Form di registrazione con validazione e gestione dello stato
 */
export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome obbligatorio';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email obbligatoria';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password obbligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La password deve essere di almeno 8 caratteri';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non corrispondono';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Devi accettare i termini e le condizioni';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Gestisce l'invio del form
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In futuro, qui faremo la chiamata API per la registrazione
      console.log('Form valido, dati:', formData);
    }
  };
  
  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Crea il tuo account</h1>
        <p className="text-muted-foreground mt-2">
          Registrati per iniziare a tracciare il tuo patrimonio
        </p>
      </div>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nome completo
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.name ? 'border-destructive' : 'border-input'
            }`}
            placeholder="Mario Rossi"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name}</p>
          )}
        </div>
        
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
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.password ? 'border-destructive' : 'border-input'
            }`}
            placeholder="Minimo 8 caratteri"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-destructive">{errors.password}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Conferma password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.confirmPassword ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-destructive">{errors.confirmPassword}</p>
          )}
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="acceptTerms">
              Accetto i{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Termini di servizio
              </Link>{' '}
              e la{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
            {errors.acceptTerms && (
              <p className="mt-1 text-sm text-destructive">{errors.acceptTerms}</p>
            )}
          </div>
        </div>
        
        <Button type="submit" className="w-full">
          Registrati
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p>
          Hai già un account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
