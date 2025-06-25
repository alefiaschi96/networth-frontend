import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/lib/services/api.service';
import { authService } from '@/lib/services/auth.service';
import { ArrowRight, Check } from 'lucide-react';

interface AccountCreationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

type Step = 'account-creation' | 'bank-account-creation';

/**
 * Form per la creazione di un nuovo account di investimento
 * 
 * @param onSuccess - Callback chiamata quando l'account viene creato con successo
 * @param onCancel - Callback chiamata quando l'utente annulla la creazione
 */
export const AccountCreationForm: React.FC<AccountCreationFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  // Stato generale
  const [currentStep, setCurrentStep] = useState<Step>('account-creation');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Stato per il primo step: creazione account
  const [accountName, setAccountName] = useState('');
  const [, setCreatedAccountId] = useState<number | null>(null);
  
  // Stato per il secondo step: creazione bank account
  const [liquidityBalance, setLiquidityBalance] = useState<string>('');
  const [bankAccountId, setBankAccountId] = useState<number | null>(null);

  /**
   * Gestisce la creazione dell'account (primo step)
   */
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountName.trim()) {
      setError('Il nome dell\'account è obbligatorio');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Ottieni l'utente corrente dal servizio di autenticazione
      const currentUser = authService.getUser() as { id: number } | null;
      
      if (!currentUser) {
        throw new Error('Utente non autenticato. Effettua il login per creare un account.');
      }

      // Crea l'account
      const accountData = await apiService.post<{ id: number }>(
        '/api/accounts',
        {
          userId: currentUser.id,
          name: accountName.trim()
        }
      );
      
      if (accountData && typeof accountData === 'object' && 'id' in accountData) {
        // Salva l'ID dell'account creato
        setCreatedAccountId(accountData.id);
        
        // Crea automaticamente un bank account vuoto associato all'account
        const bankAccountData = await apiService.post<{ id: number }>(
          '/api/bank-accounts',
          {
            accountId: accountData.id,
            balance: 0,
            currency: 'EUR'
          }
        );
        
        if (bankAccountData && typeof bankAccountData === 'object' && 'id' in bankAccountData) {
          // Salva l'ID del bank account creato
          setBankAccountId(bankAccountData.id);
          
          // Passa al secondo step
          setCurrentStep('bank-account-creation');
        } else {
          throw new Error('Risposta API non valida: manca l\'ID del bank account');
        }
      } else {
        throw new Error('Risposta API non valida: manca l\'ID dell\'account');
      }
    } catch (err: unknown) {
      // Gestione degli errori
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else if (err instanceof Error && Array.isArray(err.message)) {
        setError(err.message.join('\n'));
      } else {
        setError('Si è verificato un errore durante la creazione dell\'account');
      }
      console.error('Errore durante la creazione dell\'account:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Gestisce l'aggiornamento del bank account con il saldo di liquidità (secondo step)
   */
  const handleUpdateBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (bankAccountId) {
        // Converti la stringa in numero (se vuoto, usa 0)
        const balance = liquidityBalance ? parseFloat(liquidityBalance) : 0;
        
        // Aggiorna il bank account con il saldo di liquidità
        await apiService.put(
          `/api/bank-accounts/${bankAccountId}`,
          { balance }
        );
        
        // Completa il funnel
        onSuccess();
      } else {
        throw new Error('ID del bank account non disponibile');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError('Si è verificato un errore durante l\'aggiornamento del saldo di liquidità');
      }
      console.error('Errore durante l\'aggiornamento del bank account:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Salta il secondo step e completa il funnel
   */
  const handleSkipLiquidity = () => {
    onSuccess();
  };

  // Rendering condizionale in base allo step corrente
  if (currentStep === 'account-creation') {
    return (
      <div className="space-y-4">
        {/* Indicatore di progresso */}
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
            <span>1</span>
          </div>
          <div className="h-1 w-8 bg-neutral-200 dark:bg-neutral-700 mx-2"></div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-500">
            <span>2</span>
          </div>
          <div className="ml-3 text-sm font-medium">Creazione Account</div>
        </div>
        
        <form onSubmit={handleCreateAccount} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="accountName" className="block text-sm font-medium mb-1">
              Nome Account
            </label>
            <input
              id="accountName"
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-800"
              placeholder="Es. Conto Fineco"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Inserisci un nome descrittivo per il tuo account di investimento
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !accountName.trim()}
            >
              {isLoading ? 'Creazione in corso...' : (
                <span className="flex items-center">
                  Continua <ArrowRight size={16} className="ml-2" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }
  
  // Secondo step: inserimento liquidità
  return (
    <div className="space-y-4">
      {/* Indicatore di progresso */}
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
          <Check size={16} />
        </div>
        <div className="h-1 w-8 bg-primary mx-2"></div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
          <span>2</span>
        </div>
        <div className="ml-3 text-sm font-medium">Liquidità</div>
      </div>
      
      <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-md mb-4">
        <p className="text-green-700 dark:text-green-400 text-sm">
          Account <strong>{accountName}</strong> creato con successo!
        </p>
      </div>
      
      <form onSubmit={handleUpdateBankAccount} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="liquidityBalance" className="block text-sm font-medium mb-1">
            Saldo di Liquidità
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
              €
            </span>
            <input
              id="liquidityBalance"
              type="number"
              step="0.01"
              min="0"
              value={liquidityBalance}
              onChange={(e) => setLiquidityBalance(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-800"
              placeholder="0.00"
              disabled={isLoading}
            />
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Inserisci il saldo di liquidità disponibile in questo account (opzionale)
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkipLiquidity}
            disabled={isLoading}
          >
            Salta
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Aggiornamento in corso...' : 'Completa'}
          </Button>
        </div>
      </form>
    </div>
  );
};
