import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

// ng2-charts: directiva que renderiza el canvas del gráfico
import { BaseChartDirective } from 'ng2-charts';
// Chart.js: tipos para configurar los gráficos
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

// Servicio de la API externa de fútbol
import { FootballService } from '../../services/football.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss'
})
export class EstadisticasComponent implements OnInit {

  // Competición seleccionada (mismas opciones que en Resultados)
  competitions = [
    { code: 'PD',  name: 'LaLiga' },
    { code: 'PL',  name: 'Premier League' },
    { code: 'BL1', name: 'Bundesliga' },
    { code: 'SA',  name: 'Serie A' },
    { code: 'FL1', name: 'Ligue 1' }
  ];
  selectedCompetition: string = 'PD';

  loading: boolean = false;
  errorMessage: string = '';

  // -------------------------------------------------------
  // GRÁFICO DE BARRAS — Goles marcados por los equipos locales
  // ChartData contiene las etiquetas (equipos) y los datasets (datos)
  // -------------------------------------------------------
  barChartType: ChartType = 'bar';

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Goles como local',
        data: [],
        backgroundColor: 'rgba(26, 107, 60, 0.7)',   // verde primario con opacidad
        borderColor: '#1a6b3c',
        borderWidth: 1
      },
      {
        label: 'Goles como visitante',
        data: [],
        backgroundColor: 'rgba(245, 166, 35, 0.7)',  // naranja secundario con opacidad
        borderColor: '#f5a623',
        borderWidth: 1
      }
    ]
  };

  // Opciones del gráfico de barras
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Goles marcados por equipo (últimos partidos)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Goles' }
      }
    }
  };

  // -------------------------------------------------------
  // GRÁFICO DE TARTA — Distribución de resultados
  // (victorias locales / empates / victorias visitante)
  // -------------------------------------------------------
  pieChartType: ChartType = 'pie';

  pieChartData: ChartData<'pie'> = {
    labels: ['Victoria local', 'Empate', 'Victoria visitante'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#1a6b3c', '#adb5bd', '#f5a623'],
      hoverOffset: 8
    }]
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: {
        display: true,
        text: 'Distribución de resultados'
      }
    }
  };

  constructor(private footballService: FootballService, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('FutResult — Estadísticas');
    this.cargarEstadisticas();
  }

  // -------------------------------------------------------
  // Obtiene los partidos finalizados y calcula los datos
  // para ambos gráficos a partir de la respuesta de la API
  // -------------------------------------------------------
  cargarEstadisticas(): void {
    this.loading = true;
    this.errorMessage = '';

    this.footballService.getMatchesByCompetition(this.selectedCompetition, 'FINISHED').subscribe({
      next: (data) => {
        const partidos = data.matches || [];
        this.procesarDatosGraficos(partidos);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar los datos. Comprueba tu API Key.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // -------------------------------------------------------
  // Procesa el array de partidos y construye los datos
  // para el gráfico de barras y el de tarta
  // -------------------------------------------------------
  private procesarDatosGraficos(partidos: any[]): void {
    // --- Gráfico de tarta: contamos victorias, empates y derrotas ---
    let victoriasLocal    = 0;
    let empates           = 0;
    let victoriasVisitante = 0;

    // Mapa para acumular goles por equipo { nombreEquipo: { local: N, visitante: N } }
    const golesMap: { [equipo: string]: { local: number; visitante: number } } = {};

    partidos.forEach(match => {
      const golesLocal     = match.score?.fullTime?.home ?? 0;
      const golesVisitante = match.score?.fullTime?.away ?? 0;
      const local          = match.homeTeam?.name;
      const visitante      = match.awayTeam?.name;

      // Acumulamos goles del equipo local
      if (local) {
        if (!golesMap[local]) golesMap[local] = { local: 0, visitante: 0 };
        golesMap[local].local += golesLocal;
      }

      // Acumulamos goles del equipo visitante
      if (visitante) {
        if (!golesMap[visitante]) golesMap[visitante] = { local: 0, visitante: 0 };
        golesMap[visitante].visitante += golesVisitante;
      }

      // Contamos resultado del partido para la tarta
      if (golesLocal > golesVisitante)       victoriasLocal++;
      else if (golesLocal === golesVisitante) empates++;
      else                                   victoriasVisitante++;
    });

    // Actualizamos la tarta
    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{ ...this.pieChartData.datasets[0], data: [victoriasLocal, empates, victoriasVisitante] }]
    };

    // Tomamos los 10 equipos con más goles en casa para no saturar el gráfico
    const equipos = Object.keys(golesMap)
      .sort((a, b) => golesMap[b].local - golesMap[a].local)
      .slice(0, 10);

    // Actualizamos el gráfico de barras con las etiquetas y los datos
    this.barChartData = {
      labels: equipos,
      datasets: [
        { ...this.barChartData.datasets[0], data: equipos.map(e => golesMap[e].local) },
        { ...this.barChartData.datasets[1], data: equipos.map(e => golesMap[e].visitante) }
      ]
    };
  }
}
