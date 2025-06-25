"use client";

/**
 * Componente per l'aggiunta di una nuova transazione di investimento
 * 
 * Questo componente mostra un form modale per l'inserimento di una nuova transazione
 * di acquisto o vendita di un asset, con selezione dell'asset, quantità, prezzo e data.
 */
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast, ToastType } from "@/components/ui/Toast";
import { apiService } from "@/lib/services/api.service";

// Tipo per gli asset disponibili
interface Asset {
  id: number;
  name: string;
  ticker?: string;
  isin?: string;
}

// Interfaccia per tipizzare gli errori API
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Interfaccia per la risposta API con data
interface ApiResponse {
  data?: Asset[];
  [key: string]: unknown;
}

// Props del componente
interface TransactionFormProps {
  accountId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TransactionForm({
  accountId,
  isOpen,
  onClose,
  onSuccess,
}: TransactionFormProps) {
  // Inizializza assets come array vuoto per evitare errori con .map()
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  
  // Stati del form
  const [formData, setFormData] = useState({
    assetId: "",
    quantity: "",
    price: "",
    type: "buy",
    transactionDate: new Date(),
  });
  
  // Stati di validazione
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Carica la lista degli asset disponibili
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await apiService.get("/api/assets");
        
        // Verifica il formato della risposta e gestisci diversi casi
        if (Array.isArray(response)) {
          setAssets(response);
        } else if (response && typeof response === 'object') {
          const apiResponse = response as ApiResponse;
          
          if (apiResponse.data && Array.isArray(apiResponse.data)) {
            setAssets(apiResponse.data);
          } else {
            console.error("Formato risposta API non valido:", response);
            setToast({
              type: "error",
              message: "Formato dati degli asset non valido"
            });
          }
        } else {
          console.error("Risposta API non valida:", response);
          setToast({
            type: "error",
            message: "Risposta API non valida"
          });
        }
      } catch (error) {
        console.error("Errore nel caricamento degli asset:", error);
        setToast({
          type: "error",
          message: "Impossibile caricare la lista degli asset"
        });
      }
    };

    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen]);
  
  // Gestione del cambiamento degli input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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
  
  // Gestione del cambiamento della data
  const handleDateChange = (date: Date) => {
    setFormData(prev => ({
      ...prev,
      transactionDate: date
    }));
    
    if (errors.transactionDate) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.transactionDate;
        return newErrors;
      });
    }
  };

  // Validazione del form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.assetId) {
      newErrors.assetId = "Seleziona un asset";
    }
    
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = "Inserisci una quantità valida";
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Inserisci un prezzo valido";
    }
    
    if (!formData.type) {
      newErrors.type = "Seleziona il tipo di transazione";
    }
    
    if (!formData.transactionDate) {
      newErrors.transactionDate = "Seleziona una data per la transazione";
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
    
    setIsLoading(true);

    try {
      // Prepara i dati per l'invio all'API
      const payload = {
        accountId: parseInt(accountId),
        assetId: parseInt(formData.assetId),
        quantity: parseFloat(formData.quantity),
        price: parseFloat(formData.price),
        type: formData.type,
        transactionDate: formData.transactionDate,
      };

      // Invia la richiesta all'API
      await apiService.post("/api/investment-transactions", payload);

      // Mostra un messaggio di successo
      setToast({
        type: "success",
        message: "La transazione è stata registrata con successo"
      });

      // Chiudi il form e aggiorna i dati
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 1500);
    } catch (error: unknown) {
      console.error("Errore nell'aggiunta della transazione:", error);
      
      // Cast dell'errore al tipo ApiError per accedere in modo sicuro alle proprietà
      const apiError = error as ApiError;
      
      // Mostra un messaggio di errore
      setToast({
        type: "error",
        message: apiError.response?.data?.message || "Impossibile aggiungere la transazione"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Chiudi il toast dopo un certo periodo di tempo
  useEffect(() => {
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
      
      <Modal isOpen={isOpen} onClose={onClose} title="Nuova Transazione">
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="mb-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Inserisci i dettagli della transazione di investimento.
            </p>
          </div>
          
          {/* Asset */}
          <div className="space-y-2">
            <label htmlFor="assetId" className="block text-sm font-medium">
              Asset
            </label>
            <select
              id="assetId"
              name="assetId"
              value={formData.assetId}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded-md ${errors.assetId ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'} bg-white dark:bg-neutral-800`}
            >
              <option value="">Seleziona un asset</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id.toString()}>
                  {asset.name} {asset.ticker ? `(${asset.ticker})` : ""}
                </option>
              ))}
            </select>
            {errors.assetId && (
              <p className="text-sm text-red-500">{errors.assetId}</p>
            )}
          </div>

          {/* Tipo Transazione */}
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium">
              Tipo Transazione
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded-md ${errors.type ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'} bg-white dark:bg-neutral-800`}
            >
              <option value="buy">Acquisto</option>
              <option value="sell">Vendita</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type}</p>
            )}
          </div>

          {/* Quantità */}
          <div className="space-y-2">
            <label htmlFor="quantity" className="block text-sm font-medium">
              Quantità
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              step="0.01"
              placeholder="Es. 10.5"
              value={formData.quantity}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded-md ${errors.quantity ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'} bg-white dark:bg-neutral-800`}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity}</p>
            )}
          </div>

          {/* Prezzo */}
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium">
              Prezzo
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              placeholder="Es. 150.25"
              value={formData.price}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full p-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'} bg-white dark:bg-neutral-800`}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          {/* Data Transazione */}
          <div className="space-y-2">
            <label htmlFor="transactionDate" className="block text-sm font-medium">
              Data Transazione
            </label>
            <input
              type="date"
              id="transactionDate"
              name="transactionDate"
              value={formData.transactionDate ? format(formData.transactionDate, "yyyy-MM-dd") : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                if (date) {
                  handleDateChange(date);
                }
              }}
              disabled={isLoading}
              className={`w-full p-2 border rounded-md ${errors.transactionDate ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'} bg-white dark:bg-neutral-800`}
            />
            {errors.transactionDate && (
              <p className="text-sm text-red-500">{errors.transactionDate}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvataggio..." : "Salva"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
