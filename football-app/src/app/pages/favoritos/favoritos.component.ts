import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { Favorito } from '../../models/favorito.model';
import { FavoritosService } from '../../services/favoritos.service';
import { FootballService } from '../../services/football.service';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss'
})
export class FavoritosComponent implements OnInit {

  favoritos: Favorito[] = [];
  formulario: Favorito = this.formularioVacio();
  editando: boolean = false;

  errorMessage:   string = '';
  successMessage: string = '';
  loading:        boolean = false;

  // Bandera del país seleccionado en el formulario (REST Countries)
  formularioBandera: string = '';

  // Mapa país → URL de bandera para la tabla de favoritos
  banderasMap: Record<string, string> = {};

  competitions = [
    { code: 'PD',  name: 'LaLiga' },
    { code: 'PL',  name: 'Premier League' },
    { code: 'BL1', name: 'Bundesliga' },
    { code: 'SA',  name: 'Serie A' },
    { code: 'FL1', name: 'Ligue 1' },
    { code: 'CL',  name: 'Champions League' }
  ];

  selectedLigaCode: string = '';
  equipos:          any[]  = [];
  loadingEquipos:   boolean = false;

  constructor(
    private favoritosService: FavoritosService,
    private footballService:  FootballService,
    private countriesService: CountriesService,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle('FutResult — Favoritos');
    this.cargarFavoritos();
  }

  formularioVacio(): Favorito {
    return { equipo: '', liga: '', pais: '', nota: '' };
  }

  cargarFavoritos(): void {
    this.loading = true;
    this.favoritosService.getAll().subscribe({
      next: (data) => {
        this.favoritos = data;
        this.loading = false;
        this.cargarBanderas();
      },
      error: (err) => {
        this.errorMessage = 'No se pudo conectar con la API. ¿Está el backend levantado?';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Solicita la bandera de cada país único presente en la lista de favoritos
  private cargarBanderas(): void {
    const paisesUnicos = [...new Set(this.favoritos.map(f => f.pais).filter(p => p))];
    paisesUnicos.forEach(pais => {
      if (!this.banderasMap[pais]) {
        this.countriesService.getFlagUrl(pais).subscribe(url => {
          this.banderasMap[pais] = url;
        });
      }
    });
  }

  onLigaChange(): void {
    const comp = this.competitions.find(c => c.code === this.selectedLigaCode);
    this.formulario.liga   = comp?.name || '';
    this.formulario.equipo = '';
    this.formulario.pais   = '';
    this.formularioBandera = '';
    this.equipos = [];

    if (this.selectedLigaCode) {
      this.cargarEquipos(this.selectedLigaCode);
    }
  }

  cargarEquipos(code: string): void {
    this.loadingEquipos = true;
    this.footballService.getTeamsByCompetition(code).subscribe({
      next: (data) => {
        this.equipos = (data.teams || []).sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        this.loadingEquipos = false;
      },
      error: () => {
        this.loadingEquipos = false;
        this.errorMessage = 'No se pudieron cargar los equipos.';
      }
    });
  }

  onEquipoChange(): void {
    const team = this.equipos.find(t => t.name === this.formulario.equipo);
    if (team) {
      this.formulario.pais = team.area?.name || '';
      if (this.formulario.pais) {
        this.countriesService.getFlagUrl(this.formulario.pais).subscribe(url => {
          this.formularioBandera = url;
        });
      }
    }
  }

  guardar(): void {
    this.errorMessage   = '';
    this.successMessage = '';

    if (this.editando && this.formulario.id) {
      this.favoritosService.update(this.formulario.id, this.formulario).subscribe({
        next: () => {
          this.successMessage = 'Favorito actualizado correctamente.';
          this.cancelar();
          this.cargarFavoritos();
        },
        error: () => { this.errorMessage = 'Error al actualizar el favorito.'; }
      });
    } else {
      this.favoritosService.create(this.formulario).subscribe({
        next: () => {
          this.successMessage = 'Favorito añadido correctamente.';
          this.cancelar();
          this.cargarFavoritos();
        },
        error: () => { this.errorMessage = 'Error al crear el favorito.'; }
      });
    }
  }

  editar(favorito: Favorito): void {
    this.formulario    = { ...favorito };
    this.editando      = true;
    this.errorMessage  = '';
    this.successMessage = '';

    const comp = this.competitions.find(c => c.name === favorito.liga);
    if (comp) {
      this.selectedLigaCode = comp.code;
      this.cargarEquipos(comp.code);
    }

    if (favorito.pais) {
      this.countriesService.getFlagUrl(favorito.pais).subscribe(url => {
        this.formularioBandera = url;
      });
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que quieres eliminar este favorito?')) return;

    this.favoritosService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Favorito eliminado.';
        this.cargarFavoritos();
      },
      error: () => { this.errorMessage = 'Error al eliminar el favorito.'; }
    });
  }

  cancelar(): void {
    this.formulario        = this.formularioVacio();
    this.editando          = false;
    this.selectedLigaCode  = '';
    this.equipos           = [];
    this.formularioBandera = '';
  }
}
