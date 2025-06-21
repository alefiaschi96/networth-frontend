/**
 * Componente StatCard
 * 
 * Card per visualizzare statistiche con valore, etichetta e variazione percentuale
 */
import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  change?: {
    value: number;
    timeframe: string;
  };
  className?: string;
}

/**
 * Componente per visualizzare statistiche con valore e variazione percentuale
 * 
 * @param title - Titolo della statistica
 * @param value - Valore principale da visualizzare
 * @param icon - Icona opzionale
 * @param change - Oggetto con valore e periodo della variazione percentuale
 * @param className - Classi CSS aggiuntive
 */
export function StatCard({ title, value, icon, change, className }: StatCardProps) {
  // Determina se la variazione è positiva, negativa o neutra
  const isPositive = change && change.value > 0;
  const isNegative = change && change.value < 0;
  
  return (
    <div className={cn(
      "rounded-lg border border-neutral-200 dark:border-neutral-800 bg-card p-6 shadow-sm",
      className
    )}>
      <div className="flex justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      
      <div className="mt-2">
        <p className="text-2xl font-bold">{value}</p>
      </div>
      
      {change && (
        <div className="mt-2 flex items-center gap-1">
          <div className={cn(
            "flex items-center text-xs font-medium",
            isPositive ? "text-green-500" : "",
            isNegative ? "text-red-500" : "",
            !isPositive && !isNegative ? "text-muted-foreground" : ""
          )}>
            {isPositive && <ArrowUpIcon className="h-3 w-3 mr-1" />}
            {isNegative && <ArrowDownIcon className="h-3 w-3 mr-1" />}
            {isPositive ? '+' : ''}{change.value}%
          </div>
          <p className="text-xs text-muted-foreground">
            {change.timeframe}
          </p>
        </div>
      )}
    </div>
  );
}
