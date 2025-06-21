/**
 * Pagina Asset
 * 
 * Visualizza e gestisce gli asset dell'utente
 */
import { Briefcase, Plus, TrendingUp, TrendingDown, LineChart } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Asset',
  description: 'Visualizza e gestisci i tuoi asset',
};

/**
 * Componente per visualizzare un singolo asset
 */
function AssetCard({ 
  name, 
  ticker,
  type,
  price, 
  change,
  holdings,
  value
}: { 
  name: string;
  ticker: string;
  type: string;
  price: string;
  change: {
    value: number;
    percentage: string;
  };
  holdings: string;
  value: string;
}) {
  const isPositive = change.value >= 0;
  
  return (
    <Card className="h-full">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg">{name}</h3>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              {ticker}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>
        <Button variant="outline" size="sm">
          Dettagli
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-sm text-muted-foreground">Prezzo attuale</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-lg font-medium">{price}</p>
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
              isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            } dark:bg-opacity-20`}>
              {isPositive ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
              {change.percentage}
            </span>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Quantità</p>
          <p className="text-lg font-medium mt-1">{holdings}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">Valore totale</p>
        <p className="text-xl font-bold mt-1">{value}</p>
      </div>
      
      <div className="mt-4 h-[80px] bg-muted/40 rounded-md flex items-center justify-center">
        <p className="text-xs text-muted-foreground">Grafico andamento</p>
      </div>
    </Card>
  );
}

/**
 * Pagina degli asset
 */
export default function AssetsPage() {
  // Dati statici per la demo
  const assets = [
    {
      name: "Microsoft",
      ticker: "MSFT",
      type: "Azione",
      price: "€ 320,45",
      change: { value: 2.5, percentage: "+2.5%" },
      holdings: "25",
      value: "€ 8.011,25"
    },
    {
      name: "Apple",
      ticker: "AAPL",
      type: "Azione",
      price: "€ 175,20",
      change: { value: -0.8, percentage: "-0.8%" },
      holdings: "40",
      value: "€ 7.008,00"
    },
    {
      name: "Vanguard FTSE All-World",
      ticker: "VWCE",
      type: "ETF",
      price: "€ 105,30",
      change: { value: 0.3, percentage: "+0.3%" },
      holdings: "120",
      value: "€ 12.636,00"
    },
    {
      name: "iShares MSCI World",
      ticker: "IWDA",
      type: "ETF",
      price: "€ 78,45",
      change: { value: 0.2, percentage: "+0.2%" },
      holdings: "85",
      value: "€ 6.668,25"
    },
    {
      name: "BTP Italia 2030",
      ticker: "IT0005387052",
      type: "Obbligazione",
      price: "€ 98,75",
      change: { value: 0.1, percentage: "+0.1%" },
      holdings: "75",
      value: "€ 7.406,25"
    },
    {
      name: "Amazon",
      ticker: "AMZN",
      type: "Azione",
      price: "€ 145,80",
      change: { value: 1.2, percentage: "+1.2%" },
      holdings: "15",
      value: "€ 2.187,00"
    }
  ];

  // Calcola il valore totale degli asset
  const totalValue = assets.reduce((sum, asset) => {
    const value = parseFloat(asset.value.replace(/[^0-9,-]/g, '').replace(',', '.'));
    return sum + value;
  }, 0).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Asset</h1>
          <p className="text-muted-foreground">Visualizza e gestisci i tuoi asset</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" /> Nuovo Asset
        </Button>
      </div>
      
      {/* Statistiche generali */}
      <Card 
        title="Panoramica Asset" 
        subtitle="Valore totale e distribuzione"
        icon={<Briefcase size={18} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Valore Totale</p>
                <p className="text-2xl font-bold mt-1">€ {totalValue.replace('.', ',')}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Rendimento YTD</p>
                <p className="text-2xl font-bold mt-1 text-green-600">+4.2%</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Numero Asset</p>
                <p className="text-2xl font-bold mt-1">{assets.length}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Asset in positivo</p>
                <p className="text-2xl font-bold mt-1">{assets.filter(a => a.change.value >= 0).length}</p>
              </div>
            </div>
          </div>
          
          <div className="h-[180px] bg-muted/40 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Grafico distribuzione asset</p>
          </div>
        </div>
      </Card>
      
      {/* Filtri */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="bg-primary/10">Tutti</Button>
        <Button variant="outline">Azioni</Button>
        <Button variant="outline">ETF</Button>
        <Button variant="outline">Obbligazioni</Button>
        <Button variant="outline">Criptovalute</Button>
        <Button variant="outline">Immobili</Button>
        <Button variant="outline">Altri</Button>
      </div>
      
      {/* Lista asset */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset, index) => (
          <AssetCard
            key={index}
            name={asset.name}
            ticker={asset.ticker}
            type={asset.type}
            price={asset.price}
            change={asset.change}
            holdings={asset.holdings}
            value={asset.value}
          />
        ))}
        
        {/* Card per aggiungere un nuovo asset */}
        <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col items-center justify-center p-6 h-full">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Plus size={24} />
          </div>
          <h3 className="font-medium text-lg mb-1">Aggiungi Asset</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Aggiungi un nuovo asset al tuo portafoglio
          </p>
          <Button variant="outline">Aggiungi</Button>
        </div>
      </div>
      
      {/* Grafico andamento */}
      <Card 
        title="Andamento Asset" 
        subtitle="Performance nel tempo"
        icon={<LineChart size={18} />}
      >
        <div className="h-[300px] bg-muted/40 rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">Grafico andamento asset nel tempo</p>
        </div>
      </Card>
    </div>
  );
}
