// ============================================================
// ENTORNO DE PRODUCCIÓN
// Angular usa este fichero al compilar con --configuration=production
// ============================================================
export const environment = {
  production: true,

  // En producción el proxy PHP reenvía las peticiones a football-data.org
  footballApiUrl: 'https://ruix.iesruizgijon.es/jpineda/futresult/futresult-api/public/football.php?path=',

  footballApiKey: '',

  // URL del backend Laravel desplegado en Ruix
  // IMPORTANTE: actualizar con la ruta real donde esté el backend
  apiUrl: 'https://ruix.iesruizgijon.es/jpineda/futresult/futresult-api/public/index.php/api'
};
