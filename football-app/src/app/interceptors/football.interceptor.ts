// Importaciones necesarias para crear un interceptor funcional (Angular 17+)
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

// ============================================================
// INTERCEPTOR DE LA API DE FÚTBOL
// Un interceptor es un middleware HTTP: intercepta cada petición
// antes de que salga y puede modificarla (añadir cabeceras, tokens, etc.)
//
// Este interceptor añade automáticamente el token de autenticación
// a todas las peticiones dirigidas a la API de football-data.org,
// evitando tener que añadirlo manualmente en cada llamada del servicio.
// ============================================================
export const footballInterceptor: HttpInterceptorFn = (req, next) => {

  // Solo interceptamos las peticiones que van a la API de fútbol
  // Las peticiones a la API propia (Laravel) no necesitan este token
  if (req.url.startsWith(environment.footballApiUrl)) {

    // Clonamos la petición añadiendo la cabecera de autenticación
    // Hay que clonar porque las peticiones HTTP son inmutables en Angular
    const reqConToken = req.clone({
      setHeaders: {
        'X-Auth-Token': environment.footballApiKey
      }
    });

    return next(reqConToken);
  }

  // Si la petición no es para la API de fútbol, la dejamos pasar sin modificar
  return next(req);
};
