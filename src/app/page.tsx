import { redirect } from 'next/navigation';

/**
 * Pagina principale che reindirizza alla dashboard
 */
export default function Home() {
  // Reindirizza alla dashboard
  redirect('/dashboard');
  
  // Questo codice non verrà mai eseguito a causa del reindirizzamento
  return null;
}
