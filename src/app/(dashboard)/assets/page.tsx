/**
 * Pagina Asset
 * 
 * Visualizza e gestisce gli asset dell'utente
 */
import AssetsClient from './assets-client';

export const metadata = {
  title: 'Asset',
  description: 'Visualizza e gestisci i tuoi asset',
};

/**
 * Pagina degli asset
 */
export default function AssetsPage() {
  return <AssetsClient />;
}
