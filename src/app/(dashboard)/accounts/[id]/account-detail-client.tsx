"use client";
/**
 * Componente client per la pagina di dettaglio dell'account
 *
 * Recupera e visualizza i dati dettagliati di un singolo account di investimento
 * e permette di modificare il saldo di liquidità del bank account associato
 */
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  AlertCircle,
  LineChart,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/ui/Button";
import { apiService } from "@/lib/services/api.service";
import TransactionForm from "./transaction-form";
import { Toast, ToastType } from "@/components/ui/Toast";

/**
 * Interfacce per i dati restituiti dalle API
 */
interface AccountDetailData {
  id: number;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  investmentHoldings: Array<{
    id: number;
    assetId: number;
    accountId: number;
    quantity: number;
    averagePurchasePrice: number;
    investedAmount: number;
    currentPrice: number;
    currentValue: number;
    priceChange: number;
    percentageChange: number;
    valueChange: number;
    valuePercentageChange: number;
    asset: {
      id: number;
      name: string;
      symbol: string;
      type: string;
      category: string;
    };
  }>;
  financialData: {
    totalInvestedAmount: number;
    currentTotalValue: number;
    totalReturn: number;
    totalReturnPercentage: number;
    liquidityBalance?: number;
    totalValue: number;
  };
  bankAccounts?: Array<{
    id: number;
    accountId: number;
    balance: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

/**
 * Componente principale per la pagina di dettaglio dell'account
 */
export default function AccountDetailClient({
  accountId,
}: {
  accountId: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<AccountDetailData | null>(
    null
  );
  const [isEditingLiquidity, setIsEditingLiquidity] = useState(false);
  const [liquidityBalance, setLiquidityBalance] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  // Stato per i toast
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  // Formattazione valuta in formato italiano
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Formattazione percentuale in formato italiano
  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat("it-IT", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  // Funzione per recuperare i dati dell'account
  const fetchAccountData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Recupera i dati dell'account specifico
      const data = await apiService.get<AccountDetailData>(
        `/api/user/accounts/${accountId}`
      );
      setAccountData(data);

      // Imposta il valore iniziale del saldo di liquidità
      if (data.financialData.liquidityBalance !== undefined) {
        setLiquidityBalance(data.financialData.liquidityBalance.toString());
      }
    } catch (err) {
      console.error("Errore nel recupero dei dati dell'account:", err);
      setError("Impossibile caricare i dati dell'account. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Carica i dati dell'account all'avvio
  useEffect(() => {
    fetchAccountData();
  }, [accountId]);

  /**
   * Gestisce l'aggiornamento del saldo di liquidità
   */
  const handleUpdateLiquidity = async () => {
    if (
      !accountData ||
      !accountData.bankAccounts ||
      accountData.bankAccounts.length === 0
    ) {
      setToast({
        type: "error",
        message: "Nessun conto bancario associato a questo account.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const bankAccountId = accountData.bankAccounts[0].id;
      const balance = parseFloat(liquidityBalance);

      if (isNaN(balance)) {
        throw new Error("Il saldo deve essere un numero valido");
      }

      // Aggiorna il saldo del bank account
      await apiService.put(`/api/bank-accounts/${bankAccountId}`, {
        balance,
      });

      // Aggiorna i dati locali
      setAccountData((prevData) => {
        if (!prevData) return null;

        return {
          ...prevData,
          financialData: {
            ...prevData.financialData,
            liquidityBalance: balance,
            totalValue: prevData.financialData.currentTotalValue + balance,
          },
          bankAccounts: prevData.bankAccounts?.map((ba) =>
            ba.id === bankAccountId ? { ...ba, balance } : ba
          ),
        };
      });

      setIsEditingLiquidity(false);
      setToast({
        type: "success",
        message: "Saldo di liquidità aggiornato con successo.",
      });
    } catch (err) {
      console.error("Errore durante l'aggiornamento del saldo:", err);
      setToast({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Impossibile aggiornare il saldo di liquidità.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 p-4 rounded-lg">
        Account non trovato.
      </div>
    );
  }

  const isPositiveReturn = accountData.financialData.totalReturn >= 0;
  const hasHoldings = accountData.investmentHoldings.length > 0;
  const hasBankAccount =
    accountData.bankAccounts && accountData.bankAccounts.length > 0;

  return (
    <div className="">
      {/* Toast per notifiche */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header con navigazione */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/accounts"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">{accountData.name}</h1>
        </div>
      </div>

      {/* Panoramica finanziaria */}
      <Card title="Panoramica Finanziaria" icon={<LineChart size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colonna sinistra: Valore totale e rendimento */}
          <div>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Valore Totale</p>
              <p className="text-3xl font-bold mt-1">
                {formatCurrency(accountData.financialData.totalValue)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Investito</p>
                <p className="text-xl font-bold mt-1">
                  {formatCurrency(
                    accountData.financialData.totalInvestedAmount
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rendimento</p>
                <p
                  className={`text-xl font-bold mt-1 ${
                    isPositiveReturn ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(accountData.financialData.totalReturn)}
                  <span
                    className={`ml-2 text-sm ${
                      isPositiveReturn ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPositiveReturn ? "+" : ""}
                    {formatPercentage(
                      accountData.financialData.totalReturnPercentage
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Colonna destra: Liquidità */}
          <div className="border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Liquidità</p>
              {!isEditingLiquidity ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingLiquidity(true)}
                  className="h-8 px-2"
                >
                  <Pencil size={16} />
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingLiquidity(false)}
                    className="h-8 px-2"
                    disabled={isSaving}
                  >
                    <X size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUpdateLiquidity}
                    className="h-8 px-2"
                    disabled={isSaving}
                  >
                    <Save size={16} />
                  </Button>
                </div>
              )}
            </div>

            {!isEditingLiquidity ? (
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(
                  accountData.financialData.liquidityBalance || 0
                )}
              </p>
            ) : (
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                  €
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={liquidityBalance}
                  onChange={(e) => setLiquidityBalance(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-800"
                  placeholder="0.00"
                  disabled={isSaving}
                />
              </div>
            )}

            {hasBankAccount && (
              <p className="text-xs text-muted-foreground mt-2">
                Conto bancario: {accountData.bankAccounts?.[0].currency}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Investimenti */}
      <Card title="Investimenti" className="overflow-hidden">
        <div className="flex justify-end mb-4 px-3 pt-3">
          <Button
            onClick={() => setIsTransactionFormOpen(true)}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Nuova Transazione
          </Button>
        </div>
        {hasHoldings ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                    Asset
                  </th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                    Quantità
                  </th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                    Prezzo Attuale
                  </th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                    Valore
                  </th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                    Rendimento
                  </th>
                </tr>
              </thead>
              <tbody>
                {accountData.investmentHoldings.map((holding) => {
                  const isPositive = holding.valueChange >= 0;
                  return (
                    <tr
                      key={holding.id}
                      className="border-b border-neutral-200 dark:border-neutral-800"
                    >
                      <td className="p-3">
                        <div className="font-medium">{holding.asset.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {holding.asset.symbol}
                        </div>
                      </td>
                      <td className="p-3 text-right">{holding.quantity}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(holding.currentPrice)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(holding.currentValue)}
                      </td>
                      <td className="p-3 text-right">
                        <span
                          className={
                            isPositive ? "text-green-600" : "text-red-600"
                          }
                        >
                          {formatCurrency(holding.valueChange)}
                          <span className="ml-1 text-xs">
                            ({isPositive ? "+" : ""}
                            {formatPercentage(holding.valuePercentageChange)})
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nessun investimento presente in questo account.
          </div>
        )}
      </Card>

      <TransactionForm
        accountId={accountId}
        isOpen={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
        onSuccess={() => {
          // Ricarica i dati dell'account dopo l'aggiunta di una transazione
          fetchAccountData();
        }}
      />
    </div>
  );
}
