export const environment = {
  production: false,
  useCaptcha: false,
  //apiBaseUrl: 'https://farmacia-mercurio.com/api', //cambiar a produccion
  apiBaseUrl: 'http://mercurio.local/api',
  endpoints: {
    login: '/auth/login',
    register: '/auth/register'
  }
};
