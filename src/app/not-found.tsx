"use client";

/**
 * Pagina 404 - Not Found
 * 
 * Pagina mostrata quando l'utente naviga a un URL che non esiste
 */
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Pagina non trovata</h2>
        <p className="text-muted-foreground">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Torna alla home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
