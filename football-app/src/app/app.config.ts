// Importaciones de Angular necesarias para configurar la app
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// provideHttpClient habilita el servicio HttpClient en toda la aplicación
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Registramos HttpClient como proveedor global para poder inyectarlo en los servicios
    provideHttpClient()
  ]
};
