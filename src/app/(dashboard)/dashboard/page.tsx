/**
 * Pagina Dashboard
 * 
 * Mostra una panoramica del patrimonio dell'utente con grafici e statistiche
 * Utilizza un componente client per recuperare e visualizzare i dati dalle API
 */
import DashboardClient from './dashboard-client';

export const metadata = {
  title: 'Dashboard | NetWorth',
  description: 'Panoramica del tuo patrimonio personale',
};

/**
 * Pagina principale della dashboard con panoramica del patrimonio
 * Utilizza un componente client per le chiamate API e la visualizzazione dinamica
 */
export default function DashboardPage() {
  return <DashboardClient />;
}
