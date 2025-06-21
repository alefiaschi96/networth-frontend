"use client";

/**
 * Componente client per la pagina Account
 * 
 * Recupera e visualizza dati dinamici sugli account dell'utente e sugli investimenti
 * utilizzando le API /api/user/dashboard, /api/user/net-worth e /api/user/accounts
 */
import { useState, useEffect } from 'react';
import { LineChart, Plus, ExternalLink, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/lib/services/api.service';

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
  };
}

/**
 * Componente per visualizzare un account di investimento
 */
function AccountCard({ 
  account
}: { 
  account: AccountData;
}) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  console.log("Account", account)

  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'percent', 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  const lastUpdate = new Date(account.updatedAt).toLocaleDateString('it-IT');
  const isPositiveReturn = account.financialData.totalReturn >= 0;

  return (
    <Card className="h-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{account.name}</h3>
          <p className="text-sm text-muted-foreground">{account.type}</p>
        </div>
        <Link href={`/accounts/${account.id}`}>
          <Button variant="outline" size="sm">
            <ExternalLink size={14} className="mr-1" /> Dettagli
          </Button>
        </Link>
      </div>
      
      <div className="mt-6">
        <div className="text-2xl font-bold">{formatCurrency(account.financialData.currentTotalValue)}</div>
        <div className="flex items-center mt-1">
          <span className={`text-sm font-medium ${
            isPositiveReturn ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositiveReturn ? '+' : ''}{formatPercentage(account.financialData.totalReturnPercentage)}
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            Agg. {lastUpdate}
          </span>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="p-2 bg-muted/40 rounded-md">
          <p className="text-xs text-muted-foreground">Investito</p>
          <p className="font-medium">{formatCurrency(account.financialData.totalInvestedAmount)}</p>
        </div>
        <div className="p-2 bg-muted/40 rounded-md">
          <p className="text-xs text-muted-foreground">Rendimento</p>
          <p className={`font-medium ${isPositiveReturn ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(account.financialData.totalReturn)}
          </p>
        </div>
      </div>
    </Card>
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

  // Formattazione valuta in formato italiano
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Formattazione percentuale in formato italiano
  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'percent', 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  // Recupera i dati dalle API
  useEffect(() => {
    const fetchAccountsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Esegui le chiamate API in parallelo
        const [netWorthResponse, dashboardResponse, accountsResponse] = await Promise.all([
          apiService.get<NetWorthData>('/api/user/net-worth'),
          apiService.get<DashboardData>('/api/user/dashboard'),
          apiService.get<AccountData[]>('/api/user/accounts')
        ]);

        setNetWorthData(netWorthResponse);
        setDashboardData(dashboardResponse);
        setAccountsData(accountsResponse);
      } catch (err) {
        console.error('Errore nel recupero dei dati degli account:', err);
        setError('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Account di Investimento</h1>
          <p className="text-muted-foreground">Gestisci i tuoi account di investimento</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" /> Nuovo Account
        </Button>
      </div>
      
      {/* Statistiche generali */}
      {netWorthData && (
        <Card 
          title="Panoramica Investimenti" 
          icon={<LineChart size={18} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Valore Totale</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(netWorthData.investmentsValue)}</p>

            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Investimento Totale</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(netWorthData.totalInvestedAmount)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Rendimento Totale</p>
              <p className={`text-2xl font-bold mt-1 ${netWorthData.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netWorthData.totalReturn)}
              </p>
              <p className={`text-sm ${netWorthData.totalReturnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netWorthData.totalReturnPercentage >= 0 ? '+' : ''}
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
            <AccountCard
              key={account.id}
              account={account}
            />
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
            <Button variant="outline">Aggiungi</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Genera un colore per una categoria di asset
 * @param category - Nome della categoria
 * @returns Codice colore esadecimale
 */
function getColorForCategory(category: string): string {
  const colors: Record<string, string> = {
    'Azioni': '#4f46e5',
    'Obbligazioni': '#0891b2',
    'ETF': '#7c3aed',
    'Fondi': '#db2777',
    'Criptovalute': '#f59e0b',
    'Materie Prime': '#84cc16',
    'Immobili': '#14b8a6',
    'Liquidità': '#64748b',
    'Altro': '#6b7280'
  };

  return colors[category] || colors['Altro'];
}

// Esportazione default per l'importazione dinamica
export default AccountsClient;
