# NetWorth - Applicazione di Gestione Patrimonio Personale

![NetWorth Logo](https://via.placeholder.com/150x50?text=NetWorth)

NetWorth è un'applicazione web moderna per la gestione completa del patrimonio personale, che consente di monitorare investimenti, conti bancari, asset e transazioni in un'unica interfaccia intuitiva.

## Caratteristiche Principali

- **Dashboard Completa**: Visualizzazione immediata del patrimonio totale con grafici e statistiche
- **Gestione Investimenti**: Monitoraggio di azioni, ETF, fondi e altri strumenti finanziari
- **Conti Bancari**: Gestione di conti correnti, conti deposito e carte di credito
- **Asset Tracking**: Monitoraggio di immobili, criptovalute e altri asset
- **Transazioni**: Registrazione e categorizzazione di entrate e uscite
- **Tema Chiaro/Scuro**: Supporto completo per tema chiaro e scuro
- **Responsive Design**: Ottimizzato per dispositivi desktop e mobile

## Tecnologie Utilizzate

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, class-variance-authority
- **Tema**: next-themes per la gestione del tema chiaro/scuro
- **Icone**: lucide-react
- **Backend**: NestJS con Prisma ORM (in un repository separato)

## Struttura del Progetto

```
src/
├── app/                    # App directory di Next.js
│   ├── (dashboard)/        # Layout gruppo dashboard (autenticato)
│   │   ├── accounts/       # Pagina conti di investimento
│   │   ├── assets/         # Pagina asset
│   │   ├── banking/        # Pagina conti bancari
│   │   ├── profile/        # Pagina profilo utente
│   │   ├── settings/       # Pagina impostazioni
│   │   ├── transactions/   # Pagina transazioni
│   │   └── layout.tsx      # Layout per area autenticata
│   ├── auth/               # Pagine di autenticazione
│   │   ├── login/          # Pagina login
│   │   └── register/       # Pagina registrazione
│   ├── globals.css         # Stili globali e variabili tema
│   └── layout.tsx          # Layout principale dell'app
├── components/             # Componenti riutilizzabili
│   ├── auth/               # Componenti autenticazione
│   ├── common/             # Componenti comuni (Card, StatCard, ecc.)
│   ├── layout/             # Componenti layout (Sidebar, Topbar, ecc.)
│   ├── providers/          # Provider React (ThemeProvider, ecc.)
│   └── ui/                 # Componenti UI base (Button, ecc.)
└── lib/                    # Utility, hooks, context
    └── utils/              # Funzioni di utilità
```

## Installazione e Avvio

1. Clona il repository

```bash
git clone https://github.com/username/networth.git
cd networth/networth-frontend
```

2. Installa le dipendenze

```bash
npm install
# oppure
yarn install
# oppure
pnpm install
```

3. Avvia il server di sviluppo

```bash
npm run dev
# oppure
yarn dev
# oppure
pnpm dev
```

4. Apri [http://localhost:3000](http://localhost:3000) nel browser

## Integrazione con il Backend

Questa applicazione frontend è progettata per integrarsi con un backend NestJS. Per istruzioni su come configurare e avviare il backend, consulta il repository `networth-backend`.

## Stato del Progetto

Attualmente, l'applicazione è in fase di sviluppo con UI statica. Le funzionalità di integrazione API saranno implementate nelle prossime fasi.

## Licenza

MIT
