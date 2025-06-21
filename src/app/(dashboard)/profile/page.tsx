/**
 * Pagina Profilo Utente
 * 
 * Visualizza e gestisce le informazioni del profilo utente
 */
import { User, Settings, Lock, Bell, Shield, LogOut } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Profilo Utente',
  description: 'Gestisci il tuo profilo e le impostazioni dell\'account',
};

/**
 * Componente per una sezione delle impostazioni
 */
function SettingsSection({ 
  icon, 
  title, 
  description, 
  children 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-muted-foreground mt-1">{description}</p>
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Componente per un campo del profilo
 */
function ProfileField({ 
  label, 
  value, 
  editable = true 
}: { 
  label: string;
  value: string;
  editable?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex">
        <input
          type="text"
          defaultValue={value}
          readOnly={!editable}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            !editable ? 'bg-muted cursor-not-allowed' : 'border-input'
          }`}
        />
        {editable && (
          <Button variant="outline" className="ml-2">
            Modifica
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Pagina del profilo utente
 */
export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profilo Utente</h1>
        <p className="text-muted-foreground">Gestisci il tuo profilo e le impostazioni dell&apos;account</p>
      </div>
      
      {/* Informazioni profilo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold mb-4">
                AF
              </div>
              <h2 className="text-xl font-bold">Alessandro Fiaschi</h2>
              <p className="text-muted-foreground">alessandro@example.com</p>
              <p className="text-sm text-muted-foreground mt-1">Membro dal 10 Gennaio 2025</p>
              
              <div className="w-full mt-6">
                <Button className="w-full">Modifica Profilo</Button>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          {/* Informazioni personali */}
          <SettingsSection
            icon={<User size={20} />}
            title="Informazioni Personali"
            description="Gestisci le tue informazioni personali"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField label="Nome" value="Alessandro" />
              <ProfileField label="Cognome" value="Fiaschi" />
              <ProfileField label="Email" value="alessandro@example.com" />
              <ProfileField label="Telefono" value="+39 123 456 7890" />
              <ProfileField label="Data di nascita" value="01/01/1985" />
              <ProfileField label="Paese" value="Italia" />
            </div>
          </SettingsSection>
          
          {/* Sicurezza */}
          <SettingsSection
            icon={<Lock size={20} />}
            title="Sicurezza"
            description="Gestisci la sicurezza del tuo account"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">Ultima modifica: 15 giorni fa</p>
                </div>
                <Button variant="outline">Cambia Password</Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Autenticazione a due fattori</h4>
                  <p className="text-sm text-muted-foreground">Aumenta la sicurezza del tuo account</p>
                </div>
                <Button variant="outline">Configura</Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Sessioni attive</h4>
                  <p className="text-sm text-muted-foreground">Gestisci i dispositivi connessi</p>
                </div>
                <Button variant="outline">Visualizza</Button>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
      
      {/* Altre impostazioni */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifiche */}
        <SettingsSection
          icon={<Bell size={20} />}
          title="Notifiche"
          description="Gestisci le tue preferenze di notifica"
        >
          <div className="space-y-3">
            {[
              { id: 'email', label: 'Notifiche email', checked: true },
              { id: 'push', label: 'Notifiche push', checked: true },
              { id: 'updates', label: 'Aggiornamenti di mercato', checked: false },
              { id: 'newsletter', label: 'Newsletter settimanale', checked: true },
            ].map((item) => (
              <div key={item.id} className="flex items-center">
                <input
                  id={item.id}
                  type="checkbox"
                  defaultChecked={item.checked}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor={item.id} className="ml-2 block text-sm">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
          
          <Button className="mt-4">Salva Preferenze</Button>
        </SettingsSection>
        
        {/* Preferenze */}
        <SettingsSection
          icon={<Settings size={20} />}
          title="Preferenze"
          description="Personalizza la tua esperienza"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Valuta predefinita</label>
              <select className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollaro USA ($)</option>
                <option value="GBP">Sterlina (£)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tema</label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-primary/10">Chiaro</Button>
                <Button variant="outline" className="flex-1">Scuro</Button>
                <Button variant="outline" className="flex-1">Sistema</Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Lingua</label>
              <select className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="it">Italiano</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
          
          <Button className="mt-4">Salva Preferenze</Button>
        </SettingsSection>
      </div>
      
      {/* Privacy e Azioni account */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Privacy */}
        <SettingsSection
          icon={<Shield size={20} />}
          title="Privacy e Dati"
          description="Gestisci le impostazioni sulla privacy e i tuoi dati"
        >
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Esporta i tuoi dati
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Gestisci cookie e tracciamento
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Visualizza la Privacy Policy
            </Button>
          </div>
        </SettingsSection>
        
        {/* Azioni account */}
        <SettingsSection
          icon={<LogOut size={20} />}
          title="Azioni Account"
          description="Gestisci il tuo account"
        >
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Disattiva temporaneamente l&apos;account
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10">
              Elimina definitivamente l&apos;account
            </Button>
            <Button className="w-full mt-4">
              Logout
            </Button>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
