/**
 * Componente Card
 * 
 * Card riutilizzabile per visualizzare informazioni in modo coerente
 */
import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Componente Card per visualizzare informazioni in un contenitore stilizzato
 * 
 * @param title - Titolo della card
 * @param subtitle - Sottotitolo opzionale
 * @param icon - Icona opzionale da mostrare nell'header
 * @param className - Classi CSS aggiuntive
 * @param children - Contenuto della card
 * @param footer - Footer opzionale della card
 */
export function Card({ title, subtitle, icon, className, children, footer }: CardProps) {
  return (
    <div className={cn(
      "rounded-lg border border-neutral-200 dark:border-neutral-800 bg-card text-card-foreground shadow-sm",
      className
    )}>
      {(title || subtitle || icon) && (
        <div className="flex flex-row items-center justify-between p-6 pb-2">
          <div className="flex flex-row items-center gap-2">
            {icon && <div className="text-primary">{icon}</div>}
            <div>
              {title && <h3 className="font-medium">{title}</h3>}
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      <div className="p-6 pt-2">
        {children}
      </div>
      {footer && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 bg-muted/50">
          {footer}
        </div>
      )}
    </div>
  );
}
