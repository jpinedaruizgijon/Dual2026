// Importaciones de Angular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';   // ngIf, ngFor, DatePipe, etc.
import { FormsModule } from '@angular/forms';      // [(ngModel)] para el campo de búsqueda

// Servicio que hace las llamadas a la API de fútbol
import { FootballService } from '../../services/football.service';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.scss'
})
export class ResultadosComponent implements OnInit {

  // Lista de competiciones disponibles en el selector
  competitions = [
    { code: 'PD',  name: 'LaLiga (España)' },
    { code: 'PL',  name: 'Premier League (Inglaterra)' },
    { code: 'BL1', name: 'Bundesliga (Alemania)' },
    { code: 'SA',  name: 'Serie A (Italia)' },
    { code: 'FL1', name: 'Ligue 1 (Francia)' },
    { code: 'CL',  name: 'Champions League' }
  ];

  // Competición seleccionada por el usuario (por defecto LaLiga)
  selectedCompetition: string = 'PD';

  // Lista de partidos que devuelve la API
  matches: any[] = [];

  // Copia filtrada de los partidos (para el buscador por equipo)
  filteredMatches: any[] = [];

  // Texto que escribe el usuario en el buscador
  searchText: string = '';

  // Indica si la petición está en curso (para mostrar el spinner)
  loading: boolean = false;

  // Mensaje de error si la petición falla
  errorMessage: string = '';

  // Inyectamos el servicio de fútbol
  constructor(private footballService: FootballService) {}

  // ngOnInit se ejecuta al cargar el componente
  // Cargamos los partidos de la liga por defecto
  ngOnInit(): void {
    this.cargarPartidos();
  }

  // -------------------------------------------------------
  // Llama al servicio para obtener los partidos de la liga
  // seleccionada y los guarda en el array matches
  // -------------------------------------------------------
  cargarPartidos(): void {
    this.loading = true;
    this.errorMessage = '';
    this.matches = [];
    this.filteredMatches = [];

    this.footballService.getMatchesByCompetition(this.selectedCompetition).subscribe({
      // Si la petición tiene éxito, guardamos los partidos
      next: (data) => {
        this.matches = data.matches || [];
        this.filteredMatches = this.matches;
        this.loading = false;
      },
      // Si hay error (red, API key inválida, etc.) lo mostramos al usuario
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar los partidos. Comprueba tu API Key.';
        this.loading = false;
        console.error('Error al llamar a la API:', err);
      }
    });
  }

  // -------------------------------------------------------
  // Filtra los partidos en tiempo real según el texto
  // que escribe el usuario en el buscador
  // Se llama con (input) en la plantilla
  // -------------------------------------------------------
  filtrar(): void {
    const texto = this.searchText.toLowerCase().trim();

    if (!texto) {
      // Si el campo está vacío, mostramos todos
      this.filteredMatches = this.matches;
    } else {
      // Filtramos por nombre del equipo local o visitante
      this.filteredMatches = this.matches.filter(match =>
        match.homeTeam.name.toLowerCase().includes(texto) ||
        match.awayTeam.name.toLowerCase().includes(texto)
      );
    }
  }

  // -------------------------------------------------------
  // Devuelve la clase CSS de Bootstrap según el estado del partido
  // FINISHED = gris, IN_PLAY = verde, SCHEDULED = azul
  // -------------------------------------------------------
  getBadgeClass(status: string): string {
    switch (status) {
      case 'FINISHED':  return 'bg-secondary';
      case 'IN_PLAY':   return 'bg-success';
      case 'PAUSED':    return 'bg-warning text-dark';
      case 'SCHEDULED': return 'bg-primary';
      default:          return 'bg-light text-dark';
    }
  }

  // -------------------------------------------------------
  // Traduce el estado del partido al español
  // -------------------------------------------------------
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
