"use client";

/**
 * Componente Topbar
 * 
 * Barra superiore dell'applicazione con funzionalità di ricerca, notifiche e menu utente
 */
import { Bell, Search, Sun, Moon, Menu, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/context/auth-context';

interface TopbarProps {
  onMenuToggle: () => void;
}

/**
 * Componente Topbar per la navigazione superiore
 * 
 * @param onMenuToggle - Funzione per aprire/chiudere il menu laterale su mobile
 */
export default function Topbar({ onMenuToggle }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const handleLogout = () => {
    logout(); // Questo gestirà il logout e il reindirizzamento alla pagina di login
  };

  return (
    <div className="h-16 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between bg-background">
      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={onMenuToggle}>
          <Menu size={20} />
        </Button>
      </div>
      
      <div className="flex-1 max-w-md relative hidden md:flex">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="search"
          placeholder="Cerca..."
          className="pl-10 pr-4 py-2 w-full bg-muted rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          aria-label="Cambia tema"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        
        <Button variant="ghost" size="icon" aria-label="Notifiche">
          <Bell size={20} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Logout"
          onClick={handleLogout}
          title="Esci"
        >
          <LogOut size={20} />
        </Button>
        
        <div className="flex items-center gap-3 pl-2 ml-2 border-l border-neutral-200 dark:border-neutral-800">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
            AF
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium">Alessandro</div>
            <div className="text-xs text-muted-foreground">Utente</div>
          </div>
        </div>
      </div>
    </div>
  );
}
