// ============================================================
// FICHERO DE EJEMPLO — copia esto como environment.prod.ts
// y rellena los valores reales antes de desplegar.
// ============================================================
export const environment = {
  production: true,

  // En producción apuntamos directamente a la API (sin proxy)
  footballApiUrl: 'https://api.football-data.org/v4',

  footballApiKey: 'TU_API_KEY_AQUI',

  // URL del backend Laravel en el servidor de producción
  apiUrl: 'https://tudominio.com/api'
};
