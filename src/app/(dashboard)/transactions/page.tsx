/**
 * Pagina Transazioni
 * 
 * Visualizza e gestisce tutte le transazioni dell'utente
 */
import { ArrowUpRight, ArrowDownRight, Filter, Plus, Download, Search } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Transazioni',
  description: 'Visualizza e gestisci tutte le tue transazioni',
};

/**
 * Componente per visualizzare una singola transazione
 */
function TransactionRow({ 
  description, 
  category,
  account,
  date, 
  amount, 
  isIncoming 
}: { 
  description: string;
  category: string;
  account: string;
  date: string;
  amount: string;
  isIncoming: boolean;
}) {
  return (
    <div className="flex items-center py-4 border-b border-neutral-200 dark:border-neutral-800 last:border-0">
      <div className={`p-2 rounded-full mr-4 ${
        isIncoming ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      } dark:bg-opacity-20`}>
        {isIncoming ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
      </div>
      
      <div className="flex-1">
        <p className="font-medium">{description}</p>
        <div className="flex text-xs text-muted-foreground mt-1">
          <span>{category}</span>
          <span className="mx-2">•</span>
          <span>{account}</span>
        </div>
      </div>
      
      <div className="text-right">
        <p className={`font-medium ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
          {isIncoming ? '+' : '-'}{amount}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{date}</p>
      </div>
    </div>
  );
}

/**
 * Pagina delle transazioni
 */
export default function TransactionsPage() {
  // Dati statici per la demo
  const transactions = [
    {
      description: "Stipendio",
      category: "Reddito",
      account: "Conto Corrente",
      date: "10 Giu 2025",
      amount: "€ 2.800,00",
      isIncoming: true
    },
    {
      description: "Affitto",
      category: "Casa",
      account: "Conto Corrente",
      date: "05 Giu 2025",
      amount: "€ 850,00",
      isIncoming: false
    },
    {
      description: "Acquisto ETF VWCE",
      category: "Investimento",
      account: "Fineco",
      date: "05 Giu 2025",
      amount: "€ 1.000,00",
      isIncoming: false
    },
    {
      description: "Supermercato",
      category: "Alimentari",
      account: "Conto Corrente",
      date: "03 Giu 2025",
      amount: "€ 125,30",
      isIncoming: false
    },
    {
      description: "Dividendo MSFT",
      category: "Dividendi",
      account: "Fineco",
      date: "15 Giu 2025",
      amount: "€ 320,00",
      isIncoming: true
    },
    {
      description: "Bolletta Luce",
      category: "Utenze",
      account: "Conto Famiglia",
      date: "12 Giu 2025",
      amount: "€ 95,40",
      isIncoming: false
    },
    {
      description: "Bolletta Gas",
      category: "Utenze",
      account: "Conto Famiglia",
      date: "12 Giu 2025",
      amount: "€ 65,20",
      isIncoming: false
    },
    {
      description: "Trasferimento",
      category: "Trasferimento",
      account: "Conto Risparmio",
      date: "15 Giu 2025",
      amount: "€ 1.000,00",
      isIncoming: true
    },
    {
      description: "Interessi",
      category: "Interessi",
      account: "Conto Risparmio",
      date: "01 Giu 2025",
      amount: "€ 45,20",
      isIncoming: true
    },
    {
      description: "Prelievo",
      category: "Prelievo",
      account: "Conto Risparmio",
      date: "20 Mag 2025",
      amount: "€ 500,00",
      isIncoming: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transazioni</h1>
          <p className="text-muted-foreground">Visualizza e gestisci tutte le tue transazioni</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download size={16} className="mr-2" /> Esporta
          </Button>
          <Button>
            <Plus size={16} className="mr-2" /> Nuova
          </Button>
        </div>
      </div>
      
      {/* Filtri e ricerca */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="search"
              placeholder="Cerca transazioni..."
              className="pl-10 pr-4 py-2 w-full bg-muted rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div className="flex gap-2">
            <select className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary border-none">
              <option value="">Tutti gli account</option>
              <option value="conto-corrente">Conto Corrente</option>
              <option value="conto-risparmio">Conto Risparmio</option>
              <option value="conto-famiglia">Conto Famiglia</option>
              <option value="fineco">Fineco</option>
            </select>
            
            <select className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary border-none">
              <option value="">Tutte le categorie</option>
              <option value="reddito">Reddito</option>
              <option value="casa">Casa</option>
              <option value="investimento">Investimento</option>
              <option value="alimentari">Alimentari</option>
              <option value="utenze">Utenze</option>
            </select>
            
            <select className="px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary border-none">
              <option value="">Ultimo mese</option>
              <option value="3-mesi">Ultimi 3 mesi</option>
              <option value="6-mesi">Ultimi 6 mesi</option>
              <option value="1-anno">Ultimo anno</option>
              <option value="personalizzato">Personalizzato</option>
            </select>
            
            <Button variant="outline" size="icon">
              <Filter size={16} />
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Statistiche del periodo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Entrate (Giu)</p>
          <p className="text-2xl font-bold mt-1 text-green-600">€ 4.165,20</p>
          <p className="text-sm text-muted-foreground mt-1">4 transazioni</p>
        </Card>
        
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Uscite (Giu)</p>
          <p className="text-2xl font-bold mt-1 text-red-600">€ 2.135,90</p>
          <p className="text-sm text-muted-foreground mt-1">6 transazioni</p>
        </Card>
        
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Bilancio (Giu)</p>
          <p className="text-2xl font-bold mt-1">€ 2.029,30</p>
          <p className="text-sm text-green-600 mt-1">+48.7% rispetto a Mag</p>
        </Card>
      </div>
      
      {/* Lista transazioni */}
      <Card>
        <div className="divide-y divide-border">
          {transactions.map((transaction, index) => (
            <TransactionRow
              key={index}
              description={transaction.description}
              category={transaction.category}
              account={transaction.account}
              date={transaction.date}
              amount={transaction.amount}
              isIncoming={transaction.isIncoming}
            />
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Mostrando 10 di 156 transazioni</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Precedente</Button>
            <Button variant="outline" size="sm" className="bg-primary/10">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">...</Button>
            <Button variant="outline" size="sm">16</Button>
            <Button variant="outline" size="sm">Successiva</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
