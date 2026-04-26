import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Miga {
  label: string;
  url:   string;
}

// Mapa ruta → etiqueta legible para el usuario
const RUTAS: Record<string, string> = {
  '/inicio':       'Inicio',
  '/resultados':   'Resultados',
  '/favoritos':    'Favoritos',
  '/estadisticas': 'Estadísticas'
};

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {

  migas: Miga[] = [];

  constructor(private router: Router) {
    // Recalculamos las migas cada vez que cambia la ruta
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.calcularMigas(e.urlAfterRedirects);
      });

    // Calculamos las migas para la ruta inicial
    this.calcularMigas(this.router.url);
  }

  private calcularMigas(url: string): void {
    const ruta = url.split('?')[0]; // ignoramos queryParams

    // En la página de inicio no mostramos migas
    if (ruta === '/' || ruta === '/inicio') {
      this.migas = [];
      return;
    }

    const label = RUTAS[ruta];
    if (label) {
      this.migas = [
        { label: 'Inicio',  url: '/inicio' },
        { label,            url: ruta }
      ];
    } else {
      this.migas = [{ label: 'Inicio', url: '/inicio' }];
    }
  }
}
