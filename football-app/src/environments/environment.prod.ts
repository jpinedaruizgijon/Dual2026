// ============================================================
// ENTORNO DE PRODUCCIÓN
// Angular usa este fichero al compilar con --configuration=production
// ============================================================
export const environment = {
  production: true,

  // En producción llamamos directamente a la API de football-data.org (sin proxy)
  footballApiUrl: 'https://api.football-data.org/v4',

  footballApiKey: 'b8d30d3396f3400e8eaf7322ed505016',

  // URL del backend Laravel desplegado en Ruix
  // IMPORTANTE: actualizar con la ruta real donde esté el backend
  apiUrl: 'https://ruix.iesruizgijon.es/jpineda/futresult/futresult-api/public/api'
};
