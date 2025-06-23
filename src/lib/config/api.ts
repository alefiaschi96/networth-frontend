/**
 * Configurazione API
 * 
 * Contiene le configurazioni per le chiamate API
 */

/**
 * Determina l'URL base dell'API in base all'ambiente
 */
const getBaseUrl = () => {
  // Usa la variabile d'ambiente se disponibile (impostata da Amplify)
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL); 
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Fallback per ambiente di sviluppo locale
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Fallback per produzione se la variabile d'ambiente non è impostata
  return 'http://networth-api-alb-1856144295.eu-south-1.elb.amazonaws.com';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH_TOKEN: '/api/auth/refresh-token',
    },
    USER: {
      PROFILE: '/api/auth/me',
    },
    ACCOUNTS: {
      LIST: '/api/accounts',
      DETAILS: (id: string) => `/api/accounts/${id}`,
    },
    TRANSACTIONS: {
      LIST: '/api/transactions',
      DETAILS: (id: string) => `/api/transactions/${id}`,
    },
  },
};
