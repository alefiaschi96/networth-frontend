"use client";

/**
 * Dashboard Client Component
 * 
 * Componente client che recupera e visualizza i dati della dashboard
 * dalle API /api/user/dashboard e /api/user/net-worth
 */
import { useEffect, useState } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { apiService } from '@/lib/services/api.service';
import { useAuth } from '@/lib/context/auth-context';

// Tipi per i dati della dashboard
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
    holdings: Array<{
      id: number;
      assetId: number;
      accountId: number;
      quantity: number;
      averagePrice: number;
      currentPrice: number;
      currentValue: number;
      investedAmount: number;
      priceChange: number;
      percentageChange: number;
      valueChange: number;
      valuePercentageChange: number;
      portfolioWeight: number;
      valueDate: string;
      asset: {
        id: number;
        name: string;
        symbol: string;
        type: string;
        category: string;
      };
    }>;
  }>;
  recentTransactions: Array<{
    id: number;
    accountId: number;
    assetId: number;
    type: string;
    quantity: number;
    price: number;
    amount: number;
    transactionDate: string;
    account: {
      id: number;
      name: string;
    };
    asset: {
      id: number;
      name: string;
      symbol: string;
    };
  }>;
}

// Tipi per i dati del patrimonio netto
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

/**
 * Componente per visualizzare un account bancario o di investimento
 */
function AccountCard({ 
  title, 
  institution,
  logo = '/images/bank-generic-logo.png' // Logo generico come fallback
}: { 
  title: string; 
  institution?: string;
  logo?: string;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-neutral-100 dark:border-neutral-800">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 relative">
          <Image 
            src={logo} 
            alt={institution || title}
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          {institution && <p className="text-sm text-muted-foreground">{institution}</p>}
        </div>
      </div>
      <ChevronRight className="text-neutral-400" size={20} />
    </div>
  );
}

/**
 * Formatta un numero come valuta in Euro
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('it-IT', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Formatta una percentuale
 */
function formatPercentage(value: number): string {
  return new Intl.NumberFormat('it-IT', { 
    style: 'percent', 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
}

/**
 * Componente client per la dashboard
 */
export default function DashboardClient() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [netWorthData, setNetWorthData] = useState<NetWorthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Recupera i dati della dashboard e del patrimonio netto
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Esegui entrambe le chiamate API in parallelo
        const [dashboardResponse, netWorthResponse] = await Promise.all([
          apiService.get<DashboardData>('/api/user/dashboard'),
          apiService.get<NetWorthData>('/api/user/net-worth')
        ]);
        
        setDashboardData(dashboardResponse);
        setNetWorthData(netWorthResponse);
      } catch (err) {
        console.error('Errore nel recupero dei dati della dashboard:', err);
        setError('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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
    <div className="space-y-8">
      {/* Header con saluto */}
      <div>
        <h1 className="text-2xl font-bold">Bentornato, {user?.name || 'Utente'}!</h1>
        <p className="text-muted-foreground">Ecco un riepilogo del tuo patrimonio</p>
      </div>
      
      {/* Hero card con patrimonio netto */}
      <div className="relative w-full h-32 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/wealth-pattern.png')] opacity-20"></div>
        <div className="relative p-6 text-white">
          <h2 className="text-2xl font-bold">
            {netWorthData ? formatCurrency(netWorthData.totalNetWorth) : '€ --'}
          </h2>
          <p className="text-sm opacity-80">Il tuo Patrimonio Netto</p>
        </div>
      </div>
      
      {/* Performance finanziaria */}
      {netWorthData && (
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Performance Finanziaria Complessiva</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{formatCurrency(netWorthData.investmentsValue)}</span>
              <span className={`text-sm font-medium ${netWorthData.totalReturnPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {netWorthData.totalReturnPercentage >= 0 ? '+' : ''}
                {formatPercentage(netWorthData.totalReturnPercentage)}
              </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Valore Investimenti</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Investito</h3>
              <p className="text-xl font-bold mt-1">{formatCurrency(netWorthData.totalInvestedAmount)}</p>
            </div>
            <div className="flex-1 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Rendimento</h3>
              <p className={`text-xl font-bold mt-1 ${netWorthData.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(netWorthData.totalReturn)}
              </p>
            </div>
            <div className="flex-1 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Conti Bancari</h3>
              <p className="text-xl font-bold mt-1">{formatCurrency(netWorthData.bankAccountsValue)}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* I tuoi account */}
      {dashboardData && (
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">I tuoi Account</h2>
            <Link href="/accounts" className="text-sm text-primary hover:underline">
              Vedi tutti
            </Link>
          </div>
          
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {dashboardData.accounts.map(account => (
              <Link href={`/accounts/${account.id}`} key={account.id}>
                <AccountCard 
                  title={account.name} 
                  institution={`${account.holdings.length} asset`}
                />
              </Link>
            ))}
            
            {dashboardData.accounts.length === 0 && (
              <div className="py-8 text-center text-neutral-500">
                <p>Nessun account disponibile</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Transazioni recenti */}
      {dashboardData && dashboardData.recentTransactions.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Transazioni Recenti</h2>
            <Link href="/transactions" className="text-sm text-primary hover:underline">
              Vedi tutte
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-left text-sm text-neutral-500">
                <tr>
                  <th className="pb-2">Data</th>
                  <th className="pb-2">Asset</th>
                  <th className="pb-2">Tipo</th>
                  <th className="pb-2 text-right">Importo</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentTransactions.map(transaction => (
                  <tr key={transaction.id} className="border-t border-neutral-100 dark:border-neutral-800">
                    <td className="py-3 text-sm">
                      {new Date(transaction.transactionDate).toLocaleDateString('it-IT')}
                    </td>
                    <td className="py-3">
                      <div className="font-medium">{transaction.asset.name}</div>
                      <div className="text-xs text-neutral-500">{transaction.asset.symbol}</div>
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        transaction.type === 'buy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {transaction.type === 'buy' ? 'Acquisto' : 'Vendita'}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium">
                      {formatCurrency(transaction.quantity * transaction.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Allocazione degli asset */}
      {netWorthData && Object.keys(netWorthData.assetAllocation).length > 0 && (
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold mb-4">Allocazione degli Asset</h2>
          
          <div className="space-y-3">
            {Object.entries(netWorthData.assetAllocation).map(([category, data]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ 
                    backgroundColor: getColorForCategory(category) 
                  }}></div>
                  <span>{category}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-500">{formatPercentage(data.percentage)}</span>
                  <span className="font-medium">{formatCurrency(data.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Informazioni aggiornamento */}
      {netWorthData && (
        <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          Ultimo aggiornamento: {new Date(netWorthData.lastUpdated).toLocaleString('it-IT')}
        </div>
      )}
    </div>
  );
}

/**
 * Genera un colore per una categoria di asset
 */
function getColorForCategory(category: string): string {
  // Mappa di colori predefiniti per categorie comuni
  const colorMap: Record<string, string> = {
    'Stocks': '#4f46e5',
    'Bonds': '#0891b2',
    'Cash': '#16a34a',
    'Real Estate': '#ca8a04',
    'Crypto': '#f97316',
    'Commodities': '#9333ea',
    'ETF': '#0ea5e9',
    'Mutual Funds': '#8b5cf6',
    'Other': '#6b7280',
  };
  
  // Restituisci il colore dalla mappa o un colore predefinito
  return colorMap[category] || '#6b7280';
}
