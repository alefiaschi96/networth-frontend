/**
 * Pagina Conti Bancari
 * 
 * Visualizza e gestisce i conti bancari dell'utente
 */
import { Wallet, Plus, ExternalLink, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Conti Bancari',
  description: 'Gestisci i tuoi conti bancari e monitora la liquidità',
};

/**
 * Componente per visualizzare un conto bancario
 */
function BankAccountCard({ 
  name, 
  bank, 
  balance, 
  accountNumber, 
  lastTransactions 
}: { 
  name: string; 
  bank: string; 
  balance: string; 
  accountNumber: string;
  lastTransactions: Array<{
    description: string;
    amount: string;
    date: string;
    isIncoming: boolean;
  }>;
}) {
  return (
    <Card className="h-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{bank}</p>
          <p className="text-xs text-muted-foreground mt-1">****{accountNumber}</p>
        </div>
        <Button variant="outline" size="sm">
          <ExternalLink size={14} className="mr-1" /> Dettagli
        </Button>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">Saldo disponibile</p>
        <p className="text-2xl font-bold mt-1">{balance}</p>
      </div>
      
      <div className="mt-4">
        <p className="text-sm font-medium mb-2">Ultime transazioni</p>
        <div className="space-y-2">
          {lastTransactions.map((transaction, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-full ${
                  transaction.isIncoming ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                } dark:bg-opacity-20`}>
                  {transaction.isIncoming ? 
                    <ArrowUpRight size={12} /> : 
                    <ArrowDownRight size={12} />
                  }
                </div>
                <span className="truncate max-w-[150px]">{transaction.description}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className={transaction.isIncoming ? 'text-green-600' : 'text-red-600'}>
                  {transaction.isIncoming ? '+' : '-'}{transaction.amount}
                </span>
                <span className="text-xs text-muted-foreground">{transaction.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/**
 * Pagina dei conti bancari
 */
export default function BankingPage() {
  // Dati statici per la demo
  const accounts = [
    {
      name: "Conto Corrente",
      bank: "Intesa Sanpaolo",
      balance: "€ 15.320,00",
      accountNumber: "4582",
      lastTransactions: [
        { description: "Stipendio", amount: "€ 2.800,00", date: "10/06/2025", isIncoming: true },
        { description: "Affitto", amount: "€ 850,00", date: "05/06/2025", isIncoming: false },
        { description: "Supermercato", amount: "€ 125,30", date: "03/06/2025", isIncoming: false }
      ]
    },
    {
      name: "Conto Risparmio",
      bank: "Fineco",
      balance: "€ 22.450,00",
      accountNumber: "7891",
      lastTransactions: [
        { description: "Trasferimento", amount: "€ 1.000,00", date: "15/06/2025", isIncoming: true },
        { description: "Interessi", amount: "€ 45,20", date: "01/06/2025", isIncoming: true },
        { description: "Prelievo", amount: "€ 500,00", date: "20/05/2025", isIncoming: false }
      ]
    },
    {
      name: "Conto Famiglia",
      bank: "UniCredit",
      balance: "€ 8.750,00",
      accountNumber: "3214",
      lastTransactions: [
        { description: "Bolletta Luce", amount: "€ 95,40", date: "12/06/2025", isIncoming: false },
        { description: "Bolletta Gas", amount: "€ 65,20", date: "12/06/2025", isIncoming: false },
        { description: "Trasferimento", amount: "€ 1.200,00", date: "01/06/2025", isIncoming: true }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Conti Bancari</h1>
          <p className="text-muted-foreground">Gestisci i tuoi conti bancari e la liquidità</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" /> Nuovo Conto
        </Button>
      </div>
      
      {/* Statistiche generali */}
      <Card 
        title="Panoramica Liquidità" 
        subtitle="Saldo totale e movimenti"
        icon={<Wallet size={18} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Saldo Totale</p>
            <p className="text-2xl font-bold mt-1">€ 46.520,00</p>
            <p className="text-sm text-green-600 mt-1">+€ 3.250,00 ultimo mese</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Entrate (Giu)</p>
            <p className="text-2xl font-bold mt-1 text-green-600">€ 5.045,20</p>
            <p className="text-sm text-muted-foreground mt-1">6 transazioni</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Uscite (Giu)</p>
            <p className="text-2xl font-bold mt-1 text-red-600">€ 1.795,30</p>
            <p className="text-sm text-muted-foreground mt-1">12 transazioni</p>
          </div>
        </div>
        
        <div className="mt-6 h-[200px] bg-muted/40 rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">Grafico andamento liquidità</p>
        </div>
      </Card>
      
      {/* Lista conti bancari */}
      <div>
        <h2 className="text-xl font-semibold mb-4">I tuoi conti</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account, index) => (
            <BankAccountCard
              key={index}
              name={account.name}
              bank={account.bank}
              balance={account.balance}
              accountNumber={account.accountNumber}
              lastTransactions={account.lastTransactions}
            />
          ))}
          
          {/* Card per aggiungere un nuovo conto */}
          <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col items-center justify-center p-6 h-full">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Plus size={24} />
            </div>
            <h3 className="font-medium text-lg mb-1">Aggiungi Conto</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Collega un nuovo conto bancario
            </p>
            <Button variant="outline">Aggiungi</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
