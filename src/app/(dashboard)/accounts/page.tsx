/**
 * Pagina Account di Investimento
 * 
 * Visualizza e gestisce gli account di investimento dell'utente
 * utilizzando dati dinamici dalle API backend
 */
import AccountsClient from './accounts-client';

// Metadata per la pagina
export const metadata = {
  title: 'Account di Investimento',
  description: 'Gestisci i tuoi account di investimento',
};

/**
 * Pagina degli account di investimento
 * Utilizza un componente client per recuperare e visualizzare i dati dinamici
 */
export default function AccountsPage() {
  return <AccountsClient />;
}
