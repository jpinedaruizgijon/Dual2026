import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';

import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {

  features = [
    {
      icono: '🏆',
      titulo: 'Resultados en directo',
      descripcion: 'Consulta los resultados y marcadores de las principales ligas europeas.',
      ruta: '/resultados',
      boton: 'Ver resultados'
    },
    {
      icono: '⭐',
      titulo: 'Tus favoritos',
      descripcion: 'Guarda y gestiona tus equipos favoritos con tu lista personalizada.',
      ruta: '/favoritos',
      boton: 'Gestionar favoritos'
    },
    {
      icono: '📊',
      titulo: 'Estadísticas',
      descripcion: 'Visualiza gráficos de goles y distribución de resultados por liga.',
      ruta: '/estadisticas',
      boton: 'Ver estadísticas'
    }
  ];

  // Países de las cinco grandes ligas — info cargada desde REST Countries
  paises: any[] = [];
  loadingPaises = true;

  private readonly LIGAS = [
    { pais: 'Spain',          liga: 'LaLiga' },
    { pais: 'England',        liga: 'Premier League' },
    { pais: 'Germany',        liga: 'Bundesliga' },
    { pais: 'Italy',          liga: 'Serie A' },
    { pais: 'France',         liga: 'Ligue 1' },
  ];

  constructor(private title: Title, private countriesService: CountriesService) {}

  ngOnInit(): void {
    this.title.setTitle('FutResult — Inicio');
    this.cargarPaises();
  }

  private cargarPaises(): void {
    const peticiones = this.LIGAS.map(l =>
      this.countriesService.getCountryInfo(l.pais)
    );

    forkJoin(peticiones).subscribe({
      next: (resultados) => {
        this.paises = resultados
          .map((data, i) => data ? { ...data, liga: this.LIGAS[i].liga } : null)
          .filter(p => p !== null);
        this.loadingPaises = false;
      },
      error: () => { this.loadingPaises = false; }
    });
  }

  formatPoblacion(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K';
    return String(n);
  }
}
