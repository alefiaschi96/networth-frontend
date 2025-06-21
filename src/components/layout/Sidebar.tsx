"use client";

/**
 * Componente Sidebar
 * 
 * Barra laterale di navigazione con menu per le diverse sezioni dell'applicazione
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { 
  LayoutDashboard, 
  LineChart, 
  Wallet, 
  ArrowLeftRight, 
  Briefcase, 
  User,
  LogOut
} from 'lucide-react';

/**
 * Definizione degli elementi del menu principale
 */
const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Account',
    href: '/accounts',
    icon: LineChart,
  },
  {
    title: 'Conti Bancari',
    href: '/banking',
    icon: Wallet,
  },
  {
    title: 'Transazioni',
    href: '/transactions',
    icon: ArrowLeftRight,
  },
  {
    title: 'Asset',
    href: '/assets',
    icon: Briefcase,
  },
  {
    title: 'Profilo',
    href: '/profile',
    icon: User,
  },
];

interface SidebarProps {
  className?: string;
}

/**
 * Componente Sidebar per la navigazione principale
 * 
 * @param className - Classi CSS aggiuntive
 */
export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "flex flex-col h-full border-r border-neutral-200 dark:border-neutral-800 p-4",
      className
    )}
    style={{ backgroundColor: 'hsl(var(--background))' }}
    >
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="rounded-md p-1" style={{ backgroundColor: 'hsl(var(--primary))' }}>
          <div className="font-bold text-xl" style={{ color: 'hsl(var(--primary-foreground))' }}>NW</div>
        </div>
        <h1 className="text-xl font-bold">NetWorth</h1>
      </div>
      
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive 
                  ? "font-medium" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              style={{
                backgroundColor: isActive ? 'hsla(var(--primary), 0.1)' : '',
                color: isActive 
                  ? 'hsl(var(--primary))' 
                  : 'hsl(var(--muted-foreground))'
              }}
            >
              <item.icon size={18} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800">
        <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
