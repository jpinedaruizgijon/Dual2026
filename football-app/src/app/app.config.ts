import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// withInterceptors permite registrar interceptores HTTP funcionales
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
// Interceptor que añade el token de la API de fútbol a las peticiones
import { footballInterceptor } from './interceptors/football.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Registramos el interceptor junto con HttpClient
    provideHttpClient(withInterceptors([footballInterceptor])),
    provideCharts(withDefaultRegisterables())
  ]
};
