// Importamos el tipo Routes de Angular Router
import { Routes } from '@angular/router';

// Importamos los componentes de cada página
import { ResultadosComponent } from './pages/resultados/resultados.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';

// Definición de rutas de la aplicación
// Cada objeto relaciona una URL con el componente que debe mostrarse
export const routes: Routes = [
  // Ruta raíz: redirige automáticamente a /resultados
  { path: '', redirectTo: 'resultados', pathMatch: 'full' },

  // Página de resultados (consume la API externa de fútbol)
  { path: 'resultados', component: ResultadosComponent },

  // Página de favoritos (CRUD con la API propia)
  { path: 'favoritos', component: FavoritosComponent },

  // Página de estadísticas (gráficos con librería gráfica)
  { path: 'estadisticas', component: EstadisticasComponent },

  // Ruta comodín: cualquier URL no reconocida redirige a resultados
  { path: '**', redirectTo: 'resultados' }
];
