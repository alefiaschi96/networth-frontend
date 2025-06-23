FROM node:18-alpine AS builder

WORKDIR /app

# Copia i file di configurazione
COPY package*.json ./
COPY next.config.ts ./
COPY tsconfig.json ./

# Installa le dipendenze
RUN npm ci

# Copia il codice sorgente
COPY . .

# Build dell'applicazione
RUN npm run build

# Immagine di produzione
FROM node:18-alpine AS runner

WORKDIR /app

# Imposta variabili d'ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copia i file necessari dall'immagine di build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Esponi la porta
EXPOSE 3000

# Avvia l'applicazione con l'host impostato su 0.0.0.0 per ascoltare su tutti gli indirizzi
CMD ["npm", "start", "--", "--hostname", "0.0.0.0"]
