"use client"
/**
 * Componente client per la gestione degli asset
 * 
 * Questo componente visualizza la lista degli asset disponibili e
 * permette di crearne di nuovi tramite un wizard.
 */
import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { apiService } from "@/lib/services/api.service";
import { Button } from "@/components/ui/Button";
import { Toast, ToastType } from "@/components/ui/Toast";
import AssetForm from "./asset-form";

// Interfaccia per i dati degli asset
interface Asset {
  id: number;
  name: string;
  ticker?: string;
  isin?: string;
  category?: string;
  currency: string;
}

/**
 * Componente client per la gestione degli asset
 */
export default function AssetsClient() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  // Carica la lista degli asset
  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get("/api/assets");
      
      if (Array.isArray(response)) {
        setAssets(response);
      } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
        setAssets(response.data);
      } else {
        console.error("Formato risposta API non valido:", response);
        setToast({
          type: "error",
          message: "Impossibile caricare gli asset"
        });
      }
    } catch (error) {
      console.error("Errore nel caricamento degli asset:", error);
      setToast({
        type: "error",
        message: "Impossibile caricare gli asset"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carica gli asset all'avvio
  useEffect(() => {
    fetchAssets();
  }, []);

  // Filtra gli asset in base al termine di ricerca
  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (asset.ticker && asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (asset.isin && asset.isin.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    <div className="container mx-auto py-6">
      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Asset Finanziari</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nuovo Asset
        </Button>
      </div>
      
      {/* Barra di ricerca */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cerca per nome, ticker o ISIN..."
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Lista degli asset */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2">Caricamento asset in corso...</p>
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISIN</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valuta</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-neutral-900 dark:divide-gray-700">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{asset.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.ticker || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.isin || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.category || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? "Nessun asset trovato con i criteri di ricerca." : "Nessun asset disponibile."}
          </p>
        </div>
      )}
      
      {/* Form per la creazione di un nuovo asset */}
      <AssetForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          fetchAssets();
          setToast({
            type: "success",
            message: "Asset creato con successo"
          });
        }}
      />
    </div>
  );
}
