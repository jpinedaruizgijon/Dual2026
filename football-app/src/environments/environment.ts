export const environment = {
  production: false,

  // En desarrollo usamos /api-football para que el proxy de Angular
  // reenvíe la petición a football-data.org evitando el bloqueo CORS.
  // En producción se usará la URL directa (environment.prod.ts)
  footballApiUrl: '/api-football',

  footballApiKey: 'b8d30d3396f3400e8eaf7322ed505016',

  // URL base de la API propia (backend Laravel)
  apiUrl: 'http://localhost:8000/api'
};
