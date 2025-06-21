/**
 * Pagina Account di Investimento
 * 
 * Visualizza e gestisce gli account di investimento dell'utente
 */
import { LineChart, Plus, ExternalLink } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Account di Investimento',
  description: 'Gestisci i tuoi account di investimento',
};

/**
 * Componente per visualizzare un account di investimento
 */
function AccountCard({ 
  name, 
  broker, 
  value, 
  change, 
  lastUpdate 
}: { 
  name: string; 
  broker: string; 
  value: string; 
  change: { value: number; percentage: string }; 
  lastUpdate: string;
}) {
  return (
    <Card className="h-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{broker}</p>
        </div>
        <Button variant="outline" size="sm">
          <ExternalLink size={14} className="mr-1" /> Dettagli
        </Button>
      </div>
      
      <div className="mt-6">
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <span className={`text-sm font-medium ${
            change.value >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change.value >= 0 ? '+' : ''}{change.percentage}
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            Agg. {lastUpdate}
          </span>
        </div>
      </div>
      
      <div className="mt-4 h-[100px] bg-muted/40 rounded-md flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Grafico andamento</p>
      </div>
    </Card>
  );
}

/**
 * Pagina degli account di investimento
 */
export default function AccountsPage() {
  // Dati statici per la demo
  const accounts = [
    {
      name: "Portafoglio Azionario",
      broker: "Fineco",
      value: "€ 45.320,00",
      change: { value: 1250, percentage: "2.8%" },
      lastUpdate: "oggi"
    },
    {
      name: "ETF Portfolio",
      broker: "Degiro",
      value: "€ 28.750,00",
      change: { value: 950, percentage: "3.4%" },
      lastUpdate: "oggi"
    },
    {
      name: "Fondo Pensione",
      broker: "Amundi",
      value: "€ 12.680,00",
      change: { value: -180, percentage: "-1.4%" },
      lastUpdate: "ieri"
    },
    {
      name: "Trading Account",
      broker: "Interactive Brokers",
      value: "€ 8.500,00",
      change: { value: 320, percentage: "3.9%" },
      lastUpdate: "oggi"
    }
  ];

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
      <Card 
        title="Panoramica Investimenti" 
        subtitle="Valore totale e rendimento"
        icon={<LineChart size={18} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Valore Totale</p>
            <p className="text-2xl font-bold mt-1">€ 95.250,00</p>
            <p className="text-sm text-green-600 mt-1">+2.8% da inizio anno</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Rendimento YTD</p>
            <p className="text-2xl font-bold mt-1">€ 2.640,00</p>
            <p className="text-sm text-green-600 mt-1">+2.8%</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Rendimento Totale</p>
            <p className="text-2xl font-bold mt-1">€ 7.850,00</p>
            <p className="text-sm text-green-600 mt-1">+9.2% dall&apos;inizio</p>
          </div>
        </div>
        
        <div className="mt-6 h-[200px] bg-muted/40 rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">Grafico andamento investimenti</p>
        </div>
      </Card>
      
      {/* Lista account */}
      <div>
        <h2 className="text-xl font-semibold mb-4">I tuoi account</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account, index) => (
            <AccountCard
              key={index}
              name={account.name}
              broker={account.broker}
              value={account.value}
              change={account.change}
              lastUpdate={account.lastUpdate}
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
