#!/bin/bash

# Script di deployment automatico per il frontend su AWS ECS
# Autore: Alessandro Fiaschi
# Data: 22/06/2025

set -e  # Termina lo script se un comando fallisce

# Colori per output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funzione per mostrare l'help
show_help() {
  echo "Utilizzo: $0 [opzioni]"
  echo ""
  echo "Opzioni:"
  echo "  -h, --help             Mostra questo messaggio di aiuto"
  echo "  -s, --skip-build       Salta la fase di build Docker e usa l'immagine esistente"
  echo "  -y, --yes              Applica automaticamente Terraform senza chiedere conferma"
  echo "  -r, --region REGION    Specifica la regione AWS (default: eu-south-1)"
  echo "  -t, --tag TAG          Specifica il tag dell'immagine (default: latest)"
  echo ""
  echo "Esempio: $0 --yes"
  exit 0
}

# Funzione per stampare messaggi di log
log() {
  echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
  echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERRORE: $1${NC}"
  exit 1
}

warning() {
  echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ATTENZIONE: $1${NC}"
}

# Variabili di configurazione
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="${PROJECT_DIR}"
IAC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../networth-backend/iac" && pwd)"
AWS_REGION="eu-south-1"  # Modifica se necessario
REPOSITORY_NAME="networth-frontend"
# Usa un timestamp come tag per garantire che ogni build sia unica
TIMESTAMP=$(date +%Y%m%d%H%M%S)
IMAGE_TAG="${TIMESTAMP}"
SKIP_BUILD=false  # Impostare a true per saltare la build e usare l'immagine locale esistente
AUTO_APPLY=false  # Impostare a true per applicare automaticamente Terraform senza chiedere conferma

# Parsing dei parametri da linea di comando
while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help)
      show_help
      ;;
    -s|--skip-build)
      SKIP_BUILD=true
      shift
      ;;
    -y|--yes)
      AUTO_APPLY=true
      shift
      ;;
    -r|--region)
      AWS_REGION="$2"
      shift 2
      ;;
    -t|--tag)
      IMAGE_TAG="$2"
      shift 2
      ;;
    *)
      warning "Opzione non riconosciuta: $1"
      show_help
      ;;
  esac
done

# Verifica che AWS CLI sia installato
if ! command -v aws &> /dev/null; then
  error "AWS CLI non è installato. Installalo con 'brew install awscli' e configuralo."
fi

# Verifica che Docker sia installato e in esecuzione
if ! command -v docker &> /dev/null; then
  error "Docker non è installato. Installalo da https://www.docker.com/products/docker-desktop"
fi

if ! docker info &> /dev/null; then
  error "Docker non è in esecuzione. Avvialo e riprova."
fi

# Verifica che Terraform sia installato
if ! command -v terraform &> /dev/null; then
  error "Terraform non è installato. Installalo con 'brew install terraform'"
fi

# Ottieni l'ID dell'account AWS
log "Ottengo l'ID dell'account AWS..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text 2>/dev/null) || error "Impossibile ottenere l'ID dell'account AWS. Verifica la configurazione di AWS CLI."

# URI completo dell'immagine
ECR_REPOSITORY_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPOSITORY_NAME}"
FULL_IMAGE_URI="${ECR_REPOSITORY_URI}:${IMAGE_TAG}"

log "Preparazione al deployment del frontend su AWS ECS"
log "Account AWS: ${AWS_ACCOUNT_ID}"
log "Regione: ${AWS_REGION}"
log "Repository ECR: ${REPOSITORY_NAME}"
log "URI immagine: ${FULL_IMAGE_URI}"

# Crea il repository ECR se non esiste
log "Verifico se il repository ECR esiste..."
if ! aws ecr describe-repositories --repository-names "${REPOSITORY_NAME}" --region "${AWS_REGION}" &> /dev/null; then
  log "Creo il repository ECR ${REPOSITORY_NAME}..."
  aws ecr create-repository --repository-name "${REPOSITORY_NAME}" --region "${AWS_REGION}" || error "Impossibile creare il repository ECR"
else
  log "Il repository ECR ${REPOSITORY_NAME} esiste già."
fi

# Autenticazione al repository ECR
log "Eseguo l'autenticazione al repository ECR..."
aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${ECR_REPOSITORY_URI}" || error "Autenticazione ECR fallita"

# Gestione della build dell'immagine Docker
cd "${FRONTEND_DIR}" || error "Directory frontend non trovata"

if [ "$SKIP_BUILD" = false ]; then
  log "Costruisco l'immagine Docker del frontend per piattaforma linux/amd64..."
  log "NOTA: Questa operazione potrebbe richiedere diversi minuti, specialmente su Mac con chip Apple Silicon."
  
  # Utilizziamo sempre il Dockerfile ottimizzato
  DOCKERFILE="Dockerfile"
  if [ -f "$DOCKERFILE" ]; then
    log "Utilizzo Dockerfile."
  else
    error "Dockerfile non trovato. Impossibile procedere con il deployment."
  fi
  
  # Costruisci l'immagine Docker
  log "Eseguo build usando $DOCKERFILE..."
  docker build --platform linux/amd64 --progress=plain -f "$DOCKERFILE" -t "${REPOSITORY_NAME}:latest" . || error "Build Docker fallita"
  
  log "Build completata con successo!"
else
  log "Saltando la fase di build come richiesto. Utilizzo l'immagine esistente ${REPOSITORY_NAME}:${IMAGE_TAG}."
  
  # Verifica che l'immagine esista
  if ! docker image inspect "${REPOSITORY_NAME}:latest" &> /dev/null; then
    error "L'immagine ${REPOSITORY_NAME}:latest non esiste. Disattiva SKIP_BUILD per costruire l'immagine."
  fi
fi

# Tag e push dell'immagine su ECR
log "Taggo l'immagine Docker con timestamp ${IMAGE_TAG}..."
docker tag "${REPOSITORY_NAME}:latest" "${FULL_IMAGE_URI}" || error "Tagging dell'immagine fallito"

log "Pubblico l'immagine su ECR..."
docker push "${FULL_IMAGE_URI}" || error "Push dell'immagine su ECR fallito"

# Crea o aggiorna il file terraform.tfvars
log "Aggiorno la configurazione Terraform..."
cd "${IAC_DIR}" || error "Directory IAC non trovata"

# Verifica se esiste già un file terraform.tfvars
if [ -f "terraform.tfvars" ]; then
  # Aggiorna solo la variabile frontend_container_image se presente
  if grep -q "frontend_container_image" terraform.tfvars; then
    sed -i '' "s|frontend_container_image = .*|frontend_container_image = \"${FULL_IMAGE_URI}\"|" terraform.tfvars || warning "Impossibile aggiornare frontend_container_image in terraform.tfvars"
  else
    # Aggiungi la variabile frontend_container_image se non presente
    echo "frontend_container_image = \"${FULL_IMAGE_URI}\"" >> terraform.tfvars
  fi
else
  # Crea un nuovo file terraform.tfvars
  echo "frontend_container_image = \"${FULL_IMAGE_URI}\"" > terraform.tfvars
fi

# Gestione della conferma per applicare Terraform
if [ "$AUTO_APPLY" = false ]; then
  read -p "Vuoi procedere con l'applicazione della configurazione Terraform? (s/n): " confirm
  if [[ $confirm != [sS] ]]; then
    log "Deployment interrotto. L'immagine Docker è stata pubblicata su ECR."
    log "Puoi applicare manualmente la configurazione Terraform con 'cd ${IAC_DIR} && terraform apply'"
    exit 0
  fi
else
  log "Procedendo automaticamente con l'applicazione della configurazione Terraform..."
fi

# Inizializza Terraform
log "Inizializzo Terraform..."
terraform init || error "Inizializzazione Terraform fallita"

# Pianifica le modifiche
log "Genero il piano Terraform..."
terraform plan -out=tfplan || error "Generazione del piano Terraform fallita"

# Applica le modifiche
log "Applico la configurazione Terraform..."
terraform apply tfplan || error "Applicazione della configurazione Terraform fallita"

# Forza un nuovo deployment del servizio ECS per garantire che utilizzi la nuova immagine
log "Forzo un nuovo deployment del servizio ECS..."
aws ecs update-service --cluster networth-cluster --service networth-frontend-frontend --force-new-deployment --region "${AWS_REGION}" || warning "Impossibile forzare un nuovo deployment del servizio ECS, ma il processo continua"

log "Deployment completato con successo!"
log "L'applicazione frontend è ora in esecuzione su AWS ECS."

# Ottieni l'URL del servizio se disponibile
if aws ecs describe-services --cluster "networth-cluster" --services "networth-frontend-frontend" --region "${AWS_REGION}" &> /dev/null; then
  log "Servizio ECS deployato. Controlla la console AWS per i dettagli."
  
  # Se c'è un load balancer, mostra il suo DNS
  LB_DNS=$(aws elbv2 describe-load-balancers --region "${AWS_REGION}" --query "LoadBalancers[?contains(LoadBalancerName, 'networth')].DNSName" --output text 2>/dev/null)
  if [ -n "$LB_DNS" ]; then
    log "Puoi accedere al frontend tramite: http://${LB_DNS}"
  else
    log "Il servizio non ha un load balancer pubblico configurato."
  fi
fi

exit 0


