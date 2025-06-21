/**
 * Configurazione API
 * 
 * Contiene le configurazioni per le chiamate API
 */

export const API_CONFIG = {
  BASE_URL: 'http://networth-api-alb-1856144295.eu-south-1.elb.amazonaws.com',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
    },
    USER: {
      PROFILE: '/users/me',
    },
    ACCOUNTS: {
      LIST: '/accounts',
      DETAILS: (id: string) => `/accounts/${id}`,
    },
    TRANSACTIONS: {
      LIST: '/transactions',
      DETAILS: (id: string) => `/transactions/${id}`,
    },
  },
};
