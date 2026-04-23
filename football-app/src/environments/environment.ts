// ============================================================
// ENTORNO DE DESARROLLO
// Este fichero contiene variables que cambian entre desarrollo
// y producción. Angular sustituye este fichero por
// environment.prod.ts al compilar con --configuration=production
// ============================================================
export const environment = {
  production: false,

  // URL base de la API externa de fútbol (football-data.org)
  footballApiUrl: 'https://api.football-data.org/v4',

  // API Key de football-data.org
  // Regístrate gratis en: https://www.football-data.org/client/register
  // y sustituye este valor por tu token personal
  footballApiKey: 'TU_API_KEY_AQUI'
};
