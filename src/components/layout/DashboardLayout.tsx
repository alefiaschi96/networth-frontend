"use client";

/**
 * Componente DashboardLayout
 * 
 * Layout principale dell'applicazione con sidebar e topbar
 */
import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { cn } from '@/lib/utils/cn';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principale dell'applicazione con sidebar responsive e topbar
 * 
 * @param children - Contenuto della pagina
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>
      {/* Sidebar per mobile (overlay) */}
      <div 
        className={cn(
          "fixed inset-0 z-40 backdrop-blur-sm transition-opacity md:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ backgroundColor: 'hsla(var(--background), 0.8)' }}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar mobile */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: 'hsl(var(--background))' }}
      >
        <Sidebar />
      </div>
      
      {/* Sidebar desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <Sidebar />
      </div>
      
      {/* Contenuto principale */}
      <div className="flex flex-col flex-1 md:pl-64">
        <Topbar onMenuToggle={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
