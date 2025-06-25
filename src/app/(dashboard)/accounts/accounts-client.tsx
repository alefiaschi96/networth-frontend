"use client";

/**
 * Componente client per la pagina Account
 *
 * Recupera e visualizza dati dinamici sugli account dell'utente e sugli investimenti
 * utilizzando le API /api/user/dashboard, /api/user/net-worth e /api/user/accounts
 */
import { useState, useEffect } from "react";
import { LineChart, Plus, ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/ui/Button";
import { apiService } from "@/lib/services/api.service";
import { Modal } from "@/components/ui/Modal";
import { AccountCreationForm } from "@/components/accounts/AccountCreationForm";
import { Toast, ToastType } from "@/components/ui/Toast";

/**
 * Interfacce per i dati restituiti dalle API
 */
interface NetWorthData {
  investmentsValue: number;
  bankAccountsValue: number;
  totalNetWorth: number;
  totalInvestedAmount: number;
  totalReturn: number;
  totalReturnPercentage: number;
  assetAllocation: Record<string, { value: number; percentage: number }>;
  lastUpdated: string;
}

interface DashboardData {
  summary: {
    accountsCount: number;
    assetsCount: number;
    bankAccountsCount: number;
    investmentHoldingsCount: number;
    investmentTransactionsCount: number;
    totalPortfolioValue: number;
  };
  accounts: Array<{
    id: number;
    name: string;
    holdings: Array<unknown>;
  }>;
  recentTransactions: Array<unknown>;
}

interface AccountData {
  id: number;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  investmentHoldings: Array<unknown>;
  financialData: {
    totalInvestedAmount: number;
    currentTotalValue: number;
    totalReturn: number;
    totalReturnPercentage: number;
    liquidityBalance?: number;
    totalValue: number;
  };
}

/**
 * Componente per visualizzare un account di investimento
 */
function AccountCard({ account }: { account: AccountData }) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat("it-IT", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  const isPositiveReturn = account.financialData.totalReturn >= 0;

  return (
    <Link href={`/accounts/${account.id}`} className="block h-full">
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{account.name}</h3>
            <p className="text-xs text-muted-foreground">{account.type}</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ExternalLink size={16} />
          </Button>
        </div>

        <div className="mt-6">
          <div className="text-2xl font-bold">
            {formatCurrency(account.financialData.totalValue)}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="p-2 bg-muted/40 rounded-md">
            <p className="text-xs text-muted-foreground">Investito</p>
            <p className="font-medium">
              {formatCurrency(account.financialData.totalInvestedAmount)}
            </p>
          </div>
          <div className="p-2 bg-muted/40 rounded-md">
            <p className="text-xs text-muted-foreground">Rendimento</p>
            <p
              className={`font-medium ${
                isPositiveReturn ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(account.financialData.totalReturn)}
              <span
                className={`ml-3 text-sm font-medium ${
                  isPositiveReturn ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositiveReturn ? "+" : ""}
                {formatPercentage(account.financialData.totalReturnPercentage)}
              </span>
            </p>
          </div>
          {account.financialData.liquidityBalance !== undefined &&
            account.financialData.liquidityBalance > 0 && (
              <div className="p-2 bg-muted/40 rounded-md">
                <p className="text-xs text-muted-foreground">Liquidità</p>
                <p className="font-medium">
                  {formatCurrency(account.financialData.liquidityBalance)}
                </p>
              </div>
            )}
        </div>
      </Card>
    </Link>
  );
}

/**
 * Componente client per la pagina degli account
 */
export function AccountsClient() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [netWorthData, setNetWorthData] = useState<NetWorthData | null>(null);
  const [, setDashboardData] = useState<DashboardData | null>(null);
  const [accountsData, setAccountsData] = useState<AccountData[]>([]);
  const [showAccountWizard, setShowAccountWizard] = useState(false);

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

  // Recupera i dati dalle API
  useEffect(() => {
    const fetchAccountsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Esegui le chiamate API in parallelo
        const [netWorthResponse, dashboardResponse, accountsResponse] =
          await Promise.all([
            apiService.get<NetWorthData>("/api/user/net-worth"),
            apiService.get<DashboardData>("/api/user/dashboard"),
            apiService.get<AccountData[]>("/api/user/accounts"),
          ]);

        setNetWorthData(netWorthResponse);
        setDashboardData(dashboardResponse);
        setAccountsData(accountsResponse);
      } catch (err) {
        console.error("Errore nel recupero dei dati degli account:", err);
        setError(
          "Si è verificato un errore nel caricamento dei dati. Riprova più tardi."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountsData();
  }, []);

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

  /**
   * Gestisce la creazione con successo di un nuovo account
   * @param accountId - ID del nuovo account creato
   */
  const handleAccountCreated = async () => {
    // Chiudi il wizard
    setShowAccountWizard(false);

    // Mostra il toast di successo
    setToast({
      type: "success",
      message:
        "Account creato con successo! Ora puoi aggiungere asset e transazioni.",
    });

    // Ricarica i dati degli account
    setIsLoading(true);
    try {
      // apiService.get restituisce già i dati JSON elaborati
      const data = await apiService.get<AccountData[]>("/api/user/accounts");
      setAccountsData(data);
    } catch (err) {
      console.error("Errore durante il caricamento degli account:", err);
      setToast({
        type: "error",
        message: "Impossibile caricare i dati aggiornati degli account.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast per notifiche */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Account di Investimento</h1>
          <p className="text-muted-foreground">
            Gestisci i tuoi account di investimento
          </p>
        </div>
        <Button onClick={() => setShowAccountWizard(true)}>
          <Plus size={16} className="mr-2" /> Nuovo Account
        </Button>
      </div>

      {/* Modale per la creazione dell'account */}
      <Modal
        isOpen={showAccountWizard}
        onClose={() => setShowAccountWizard(false)}
        title="Crea un nuovo account di investimento"
      >
        <AccountCreationForm
          onSuccess={handleAccountCreated}
          onCancel={() => setShowAccountWizard(false)}
        />
      </Modal>

      {/* Statistiche generali */}
      {netWorthData && (
        <Card title="Panoramica Investimenti" icon={<LineChart size={18} />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Valore Totale</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(netWorthData.investmentsValue)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Investimento Totale
              </p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(netWorthData.totalInvestedAmount)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Rendimento Totale</p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  netWorthData.totalReturn >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(netWorthData.totalReturn)}
              </p>
              <p
                className={`text-sm ${
                  netWorthData.totalReturnPercentage >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {netWorthData.totalReturnPercentage >= 0 ? "+" : ""}
                {formatPercentage(netWorthData.totalReturnPercentage)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Lista account */}
      <div>
        <h2 className="text-xl font-semibold mb-4">I tuoi account</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountsData.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}

          {/* Card per aggiungere un nuovo account */}
          <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col items-center justify-center p-6 h-full">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Plus size={24} />
            </div>
            <h3 className="font-medium text-lg mb-1">Aggiungi Account</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Collega un nuovo account di investimento
            </p>
            <Button
              variant="outline"
              onClick={() => setShowAccountWizard(true)}
            >
              Aggiungi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Esportazione default per l'importazione dinamica
export default AccountsClient;
