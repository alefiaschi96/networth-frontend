"use client";

/**
 * Pagina di errore globale
 * 
 * Gestisce gli errori a livello di applicazione
 */
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log dell'errore in console per debug
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold text-destructive">Oops!</h1>
        <h2 className="text-2xl font-semibold">Si è verificato un errore</h2>
        <p className="text-muted-foreground">
          Ci scusiamo per l&apos;inconveniente. Puoi provare a ricaricare la pagina o tornare alla home.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCcw size={16} />
            Riprova
          </Button>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Torna alla home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
