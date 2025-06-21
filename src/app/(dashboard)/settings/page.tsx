/**
 * Pagina Impostazioni
 * 
 * Gestisce le impostazioni generali dell'applicazione
 */
import { Settings, Globe, Database, Bell, Shield, Download, Upload } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Impostazioni',
  description: 'Gestisci le impostazioni dell\'applicazione',
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
 * Componente per un'opzione con toggle
 */
function ToggleOption({ 
  label, 
  description, 
  enabled = false 
}: { 
  label: string;
  description: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-800 last:border-0">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={enabled} className="sr-only peer" />
        <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );
}

/**
 * Pagina delle impostazioni
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Impostazioni</h1>
        <p className="text-muted-foreground">Gestisci le impostazioni dell&apos;applicazione</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Impostazioni generali */}
        <SettingsSection
          icon={<Settings size={20} />}
          title="Impostazioni Generali"
          description="Configura le impostazioni generali dell'applicazione"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Valuta predefinita</label>
              <select className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollaro USA ($)</option>
                <option value="GBP">Sterlina (£)</option>
                <option value="CHF">Franco Svizzero (CHF)</option>
                <option value="JPY">Yen Giapponese (¥)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Formato data</label>
              <select className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                <option value="yyyy-mm-dd">YYYY-MM-DD</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Formato numeri</label>
              <select className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="it">1.000,00</option>
                <option value="en">1,000.00</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Primo giorno della settimana</label>
              <select className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="monday">Lunedì</option>
                <option value="sunday">Domenica</option>
              </select>
            </div>
            
            <Button>Salva Impostazioni</Button>
          </div>
        </SettingsSection>
        
        {/* Impostazioni visualizzazione */}
        <SettingsSection
          icon={<Globe size={20} />}
          title="Visualizzazione"
          description="Personalizza l'aspetto dell'applicazione"
        >
          <div className="space-y-4">
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
                <option value="de">Deutsch</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Densità contenuti</label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Compatta</Button>
                <Button variant="outline" className="flex-1 bg-primary/10">Media</Button>
                <Button variant="outline" className="flex-1">Ampia</Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Dimensione caratteri</label>
              <input
                type="range"
                min="1"
                max="5"
                defaultValue="3"
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Piccolo</span>
                <span>Medio</span>
                <span>Grande</span>
              </div>
            </div>
            
            <Button>Applica</Button>
          </div>
        </SettingsSection>
        
        {/* Impostazioni dati */}
        <SettingsSection
          icon={<Database size={20} />}
          title="Dati e Sincronizzazione"
          description="Gestisci i tuoi dati e la sincronizzazione"
        >
          <div className="space-y-4">
            <ToggleOption
              label="Sincronizzazione automatica"
              description="Sincronizza automaticamente i dati tra i dispositivi"
              enabled={true}
            />
            
            <ToggleOption
              label="Backup automatico"
              description="Crea backup automatici dei tuoi dati"
              enabled={true}
            />
            
            <ToggleOption
              label="Aggiornamento prezzi automatico"
              description="Aggiorna automaticamente i prezzi degli asset"
              enabled={true}
            />
            
            <div className="pt-4 flex flex-wrap gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                Esporta dati
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Upload size={16} />
                Importa dati
              </Button>
            </div>
          </div>
        </SettingsSection>
        
        {/* Notifiche */}
        <SettingsSection
          icon={<Bell size={20} />}
          title="Notifiche"
          description="Gestisci le preferenze di notifica"
        >
          <div className="space-y-4">
            <ToggleOption
              label="Notifiche via email"
              description="Ricevi notifiche importanti via email"
              enabled={true}
            />
            
            <ToggleOption
              label="Notifiche push"
              description="Ricevi notifiche push sul browser"
              enabled={false}
            />
            
            <ToggleOption
              label="Notifiche transazioni"
              description="Ricevi notifiche per nuove transazioni"
              enabled={true}
            />
            
            <ToggleOption
              label="Avvisi di mercato"
              description="Ricevi avvisi su cambiamenti significativi del mercato"
              enabled={false}
            />
            
            <ToggleOption
              label="Rapporti settimanali"
              description="Ricevi un rapporto settimanale sul tuo patrimonio"
              enabled={true}
            />
            
            <Button>Salva Preferenze</Button>
          </div>
        </SettingsSection>
        
        {/* Privacy e Sicurezza */}
        <SettingsSection
          icon={<Shield size={20} />}
          title="Privacy e Sicurezza"
          description="Gestisci le impostazioni di privacy e sicurezza"
        >
          <div className="space-y-4">
            <ToggleOption
              label="Autenticazione a due fattori"
              description="Richiedi un secondo fattore per l'accesso"
              enabled={false}
            />
            
            <ToggleOption
              label="Blocco automatico"
              description="Blocca automaticamente l'app dopo 10 minuti di inattività"
              enabled={true}
            />
            
            <ToggleOption
              label="Condivisione dati anonimi"
              description="Condividi dati anonimi per migliorare il servizio"
              enabled={true}
            />
            
            <ToggleOption
              label="Cronologia ricerche"
              description="Salva la cronologia delle ricerche"
              enabled={true}
            />
            
            <div className="pt-4">
              <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10">
                Elimina tutti i dati
              </Button>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
