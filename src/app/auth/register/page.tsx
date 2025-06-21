/**
 * Pagina di registrazione
 * 
 * Consente ai nuovi utenti di creare un account
 */
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export const metadata = {
  title: 'Registrazione | NetWorth',
  description: 'Crea un nuovo account su NetWorth',
};

/**
 * Pagina di registrazione con form per la creazione di un nuovo account
 */
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="mb-8 text-center">
        <Link href="/" className="flex items-center justify-center gap-2">
          <div className="bg-primary rounded-md p-1">
            <div className="text-primary-foreground font-bold text-xl">NW</div>
          </div>
          <h1 className="text-2xl font-bold">NetWorth</h1>
        </Link>
        <p className="text-muted-foreground mt-2">
          Inizia a tracciare il tuo patrimonio in modo semplice
        </p>
      </div>
      
      <RegisterForm />
    </div>
  );
}
