/**
 * Layout principale per le pagine autenticate
 * 
 * Questo layout include la sidebar e la topbar ed è utilizzato per tutte le pagine
 * che richiedono autenticazione
 */
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | NetWorth',
    default: 'NetWorth - Gestione Patrimonio Personale',
  },
  description: 'Monitora e gestisci il tuo patrimonio personale in modo semplice ed efficace',
};

/**
 * Layout principale per le pagine autenticate
 * 
 * @param children - Contenuto della pagina
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
