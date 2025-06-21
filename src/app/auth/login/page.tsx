/**
 * Pagina di login
 * 
 * Consente agli utenti di accedere all'applicazione
 */
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata = {
  title: 'Login | NetWorth',
  description: 'Accedi alla tua dashboard di NetWorth',
};

/**
 * Pagina di login con form di autenticazione
 */
export default function LoginPage() {
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
          Monitora e gestisci il tuo patrimonio in modo semplice
        </p>
      </div>
      
      <LoginForm />
    </div>
  );
}
