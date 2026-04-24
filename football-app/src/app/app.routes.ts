import { Routes } from '@angular/router';

import { InicioComponent } from './pages/inicio/inicio.component';
import { ResultadosComponent } from './pages/resultados/resultados.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';

export const routes: Routes = [
  // Ruta raíz: carga la página de inicio/bienvenida
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  // Página de bienvenida con accesos directos a cada sección
  { path: 'inicio', component: InicioComponent },

  // Página de resultados (API externa de fútbol)
  { path: 'resultados', component: ResultadosComponent },

  // Página de favoritos (CRUD con la API propia)
  { path: 'favoritos', component: FavoritosComponent },

  // Página de estadísticas (gráficos con Chart.js)
  { path: 'estadisticas', component: EstadisticasComponent },

  // Ruta comodín: cualquier URL no reconocida va al inicio
  { path: '**', redirectTo: 'inicio' }
];
