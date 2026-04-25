import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { FootballService } from '../../services/football.service';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.scss'
})
export class ResultadosComponent implements OnInit {

  competitions = [
    { code: 'PD',  name: 'LaLiga (España)' },
    { code: 'PL',  name: 'Premier League (Inglaterra)' },
    { code: 'BL1', name: 'Bundesliga (Alemania)' },
    { code: 'SA',  name: 'Serie A (Italia)' },
    { code: 'FL1', name: 'Ligue 1 (Francia)' },
    { code: 'CL',  name: 'Champions League' }
  ];

  selectedCompetition: string = 'PD';

  // Todos los partidos descargados de la API (ya ordenados)
  matches: any[] = [];

  // Copia filtrada por el buscador (sobre la que se pagina)
  filteredMatches: any[] = [];

  searchText:    string  = '';
  loading:       boolean = false;
  errorMessage:  string  = '';

  // -------------------------------------------------------
  // PAGINACIÓN
  // -------------------------------------------------------
  paginaActual:      number = 1;
  partidosPorPagina: number = 10;

  // Número total de páginas calculado sobre los partidos filtrados
  get totalPaginas(): number {
    return Math.ceil(this.filteredMatches.length / this.partidosPorPagina);
  }

  // Array de números de página para el *ngFor del paginador [1, 2, 3 ...]
  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  // Partidos que se muestran en la página actual (slice del array filtrado)
  get partidosPagina(): any[] {
    const inicio = (this.paginaActual - 1) * this.partidosPorPagina;
    const fin    = inicio + this.partidosPorPagina;
    return this.filteredMatches.slice(inicio, fin);
  }

  // Índice del último partido visible en la página actual
  // Se usa en el texto "Mostrando X – Y de Z"
  get ultimoVisible(): number {
    return Math.min(this.paginaActual * this.partidosPorPagina, this.filteredMatches.length);
  }

  constructor(private footballService: FootballService, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('FutResult — Resultados');
    this.cargarPartidos();
  }

  cargarPartidos(): void {
    this.loading = true;
    this.errorMessage = '';
    this.matches = [];
    this.filteredMatches = [];
    this.paginaActual = 1;

    this.footballService.getMatchesByCompetition(this.selectedCompetition).subscribe({
      next: (data) => {
        // Ordenamos por jornada descendente y por fecha descendente dentro de la misma jornada
        // así la última jornada jugada aparece siempre la primera
        this.matches = (data.matches || []).sort((a: any, b: any) => {
          if (b.matchday !== a.matchday) return b.matchday - a.matchday;
          return new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime();
        });
        this.filteredMatches = this.matches;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar los partidos. Comprueba tu API Key.';
        this.loading = false;
        console.error('Error al llamar a la API:', err);
      }
    });
  }

  filtrar(): void {
    const texto = this.searchText.toLowerCase().trim();
    // Al filtrar volvemos siempre a la primera página
    this.paginaActual = 1;

    this.filteredMatches = texto
      ? this.matches.filter(match =>
          match.homeTeam.name.toLowerCase().includes(texto) ||
          match.awayTeam.name.toLowerCase().includes(texto)
        )
      : this.matches;
  }

  // Navega a una página concreta
  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      // Scrolleamos al principio de la lista para no perder la referencia visual
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'FINISHED':  return 'bg-secondary';
      case 'IN_PLAY':   return 'bg-success';
      case 'PAUSED':    return 'bg-warning text-dark';
      case 'SCHEDULED': return 'bg-primary';
      default:          return 'bg-light text-dark';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'FINISHED':  return 'Finalizado';
      case 'IN_PLAY':   return 'En juego';
      case 'PAUSED':    return 'Descanso';
      case 'SCHEDULED': return 'Programado';
      default:          return status;
    }
  }
}
