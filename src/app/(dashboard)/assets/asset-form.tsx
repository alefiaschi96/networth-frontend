/**
 * Componente per la creazione di un nuovo asset
 * 
 * Questo componente implementa un wizard per censire un nuovo asset finanziario,
 * verificando l'esistenza del titolo tramite Yahoo Finance.
 */
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { apiService } from '@/lib/services/api.service';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Toast, ToastType } from '@/components/ui/Toast';

// Tipo per gli asset disponibili
interface Asset {
  id: number;
  name: string;
  ticker?: string;
  isin?: string;
}

interface ValidateIsinResponse {
  symbol: string;
  name: string;
  currency: string;
  category: string;
}

// Props del componente
interface AssetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Componente per la creazione di un nuovo asset
 */
export default function AssetForm({
  isOpen,
  onClose,
  onSuccess,
}: AssetFormProps) {
  // Stati del form
  const [formData, setFormData] = useState({
    name: '',
    isin: '',
    category: '',
    currency: ''
  });
  
  // Stati di UI
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validatedIsin, setValidatedIsin] = useState(false);

  // Gestione del cambiamento degli input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Se stiamo modificando l'ISIN, resetta lo stato di validazione
    if (name === 'isin' && value !== formData.isin) {
      setValidatedIsin(false);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Rimuovi l'errore quando l'utente modifica il campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  /**
   * Valida l'ISIN tramite l'API
   * Questa funzione verifica se l'ISIN esiste su Yahoo Finance
   */
  const validateIsin = async () => {
    if (!formData.isin || formData.isin.length !== 12) {
      setErrors(prev => ({
        ...prev,
        isin: "Il codice ISIN deve essere di 12 caratteri alfanumerici"
      }));
      return;
    }
    
    setIsValidating(true);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.isin;
      return newErrors;
    });
    
    try {
      // Facciamo una richiesta GET per verificare l'ISIN e ottenere i dati dell'asset
      const response = await apiService.get(`/api/assets/validate?isin=${formData.isin}`) as { data:ValidateIsinResponse };
      
      // Se arriviamo qui, l'ISIN è valido
      setValidatedIsin(true);
      
      // Aggiorniamo i dati del form con quelli restituiti dall'API
      if (response.data && response.data) {
        const assetData = response.data;
        setFormData(prev => ({
          ...prev,
          name: assetData.name,
          currency: assetData.currency,
          category: assetData.category
        }));
      }
      
      setToast({
        type: "success",
        message: "ISIN verificato con successo"
      });
    } catch (error: unknown) {
      // Cast dell'errore a tipo con response per accedere in modo sicuro alle proprietà
      const apiError = error as { response?: { data?: { message?: string }, status?: number } };
      
      if (apiError.response?.status === 400) {
        setErrors(prev => ({
          ...prev,
          isin: apiError.response?.data?.message || "ISIN non valido o non trovato su Yahoo Finance"
        }));
      } else {
        setToast({
          type: "error",
          message: "Errore durante la verifica dell'ISIN"
        });
      }
    } finally {
      setIsValidating(false);
    }
  };

  // Validazione del form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Il nome dell'asset è obbligatorio";
    }
    
    if (!formData.isin.trim()) {
      newErrors.isin = "Il codice ISIN è obbligatorio";
    } else if (!/^[A-Z0-9]{12}$/.test(formData.isin)) {
      newErrors.isin = "Il codice ISIN deve essere di 12 caratteri alfanumerici";
    } else if (!validatedIsin) {
      // Se l'ISIN è formalmente corretto ma non è stato validato
      newErrors.isin = "Clicca su 'Verifica ISIN' prima di procedere";
    }
    
    if (!formData.category) {
      newErrors.category = "La categoria è obbligatoria";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestione dell'invio del form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Verifica che l'ISIN sia stato validato
    if (!validatedIsin && formData.isin) {
      setErrors(prev => ({
        ...prev,
        isin: "Clicca su 'Verifica ISIN' prima di procedere"
      }));
      return;
    }
    
    setIsLoading(true);

    try {
      // Invia la richiesta all'API per creare il nuovo asset
      const response = await apiService.post("/api/assets", formData) as { data: { asset: Asset } };

      // Mostra un messaggio di successo con dettagli dell'asset creato
      setToast({
        type: "success",
        message: `Asset ${response.data?.asset?.name || ''} creato con successo`
      });

      // Chiudi il form e aggiorna i dati dopo un breve ritardo
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error: unknown) {
      console.error("Errore nella creazione dell'asset:", error);
      
      // Cast dell'errore a tipo con response per accedere in modo sicuro alle proprietà
      const apiError = error as { response?: { data?: { message?: string }, status?: number } };
      
      // Gestione specifica degli errori
      if (apiError.response?.status === 400 && apiError.response?.data?.message?.includes('ISIN')) {
        // Errore di validazione ISIN
        setErrors(prev => ({
          ...prev,
          isin: apiError.response?.data?.message || "ISIN non valido o non trovato"
        }));
        setValidatedIsin(false);
      } else {
        // Altri errori
        setToast({
          type: "error",
          message: apiError.response?.data?.message || "Impossibile creare l'asset"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Chiudi il toast dopo un certo periodo di tempo
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <>
      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)}
        />
      )}
      
      <Modal isOpen={isOpen} onClose={onClose} title="Nuovo Asset">
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="mb-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Inserisci i dettagli del nuovo asset finanziario.
              Il sistema verificherà l&apos;esistenza del titolo tramite Yahoo Finance.
            </p>
          </div>
          
          {/* ISIN */}
          <div className="space-y-2">
            <label htmlFor="isin" className="block text-sm font-medium">
              Codice ISIN
            </label>
            <div className="flex space-x-2">
              <div className="flex-grow relative">
                <input
                  type="text"
                  id="isin"
                  name="isin"
                  value={formData.isin}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 ${validatedIsin ? 'border-green-500 dark:border-green-700' : ''}`}
                  placeholder="Es. IT0001234567"
                  maxLength={12}
                  style={{ textTransform: 'uppercase' }}
                />
                {validatedIsin && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={validateIsin}
                disabled={isValidating || !formData.isin || formData.isin.length !== 12}
              >
                {isValidating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifica
                  </span>
                ) : "Verifica ISIN"}
              </Button>
            </div>
            {errors.isin && <p className="text-sm text-red-500">{errors.isin}</p>}
            {validatedIsin && <p className="text-sm text-green-500">ISIN verificato con successo</p>}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Annulla
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Creazione in corso..." : "Crea Asset"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );

}