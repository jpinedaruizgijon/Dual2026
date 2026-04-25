import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { Favorito } from '../../models/favorito.model';
import { FavoritosService } from '../../services/favoritos.service';
// Necesitamos FootballService para cargar equipos reales de la API externa
import { FootballService } from '../../services/football.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss'
})
export class FavoritosComponent implements OnInit {

  // Lista de favoritos guardados en nuestra API propia
  favoritos: Favorito[] = [];

  // Objeto enlazado con los campos del formulario
  formulario: Favorito = this.formularioVacio();

  // true = modo edición / false = modo creación
  editando: boolean = false;

  // Mensajes de feedback al usuario
  errorMessage:   string = '';
  successMessage: string = '';

  // Spinner mientras carga la tabla de favoritos
  loading: boolean = false;

  // -------------------------------------------------------
  // Datos para los selects dinámicos de la API externa
  // -------------------------------------------------------

  // Lista de competiciones disponibles (igual que en Resultados)
  competitions = [
    { code: 'PD',  name: 'LaLiga' },
    { code: 'PL',  name: 'Premier League' },
    { code: 'BL1', name: 'Bundesliga' },
    { code: 'SA',  name: 'Serie A' },
    { code: 'FL1', name: 'Ligue 1' },
    { code: 'CL',  name: 'Champions League' }
  ];

  // Código de la liga seleccionada en el select (ej: 'PD')
  // Se usa internamente para llamar a la API, no se guarda en BD
  selectedLigaCode: string = '';

  // Equipos que devuelve la API para la liga seleccionada
  equipos: any[] = [];

  // Spinner mientras se cargan los equipos de la API
  loadingEquipos: boolean = false;

  constructor(
    private favoritosService: FavoritosService,
    private footballService: FootballService,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle('FutResult — Favoritos');
    this.cargarFavoritos();
  }

  formularioVacio(): Favorito {
    return { equipo: '', liga: '', pais: '', nota: '' };
  }

  // -------------------------------------------------------
  // Obtiene todos los favoritos guardados en el backend Laravel
  // -------------------------------------------------------
  cargarFavoritos(): void {
    this.loading = true;
    this.favoritosService.getAll().subscribe({
      next: (data) => {
        this.favoritos = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'No se pudo conectar con la API. ¿Está el backend levantado?';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // -------------------------------------------------------
  // Se ejecuta cuando el usuario cambia la liga en el select.
  // Actualiza formulario.liga con el nombre y llama a la API
  // externa para cargar los equipos de esa competición.
  // -------------------------------------------------------
  onLigaChange(): void {
    // Buscamos el objeto completo de la competición por su código
    const comp = this.competitions.find(c => c.code === this.selectedLigaCode);

    // Guardamos el nombre de la liga en el formulario (lo que irá a la BD)
    this.formulario.liga   = comp?.name || '';
    // Reseteamos equipo y país porque la liga ha cambiado
    this.formulario.equipo = '';
    this.formulario.pais   = '';
    this.equipos = [];

    if (this.selectedLigaCode) {
      this.cargarEquipos(this.selectedLigaCode);
    }
  }

  // -------------------------------------------------------
  // Llama a la API externa para obtener los equipos de
  // la competición seleccionada y los guarda en this.equipos
  // -------------------------------------------------------
  cargarEquipos(code: string): void {
    this.loadingEquipos = true;
    this.footballService.getTeamsByCompetition(code).subscribe({
      next: (data) => {
        // Ordenamos los equipos alfabéticamente para facilitar la búsqueda
        this.equipos = (data.teams || []).sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        this.loadingEquipos = false;
      },
      error: () => {
        this.loadingEquipos = false;
        this.errorMessage = 'No se pudieron cargar los equipos de la API.';
      }
    });
  }

  // -------------------------------------------------------
  // Se ejecuta cuando el usuario elige un equipo en el select.
  // Rellena automáticamente el campo país con el área del equipo.
  // -------------------------------------------------------
  onEquipoChange(): void {
    const team = this.equipos.find(t => t.name === this.formulario.equipo);
    if (team) {
      // area.name viene de la API en inglés (ej: "Spain", "Germany")
      this.formulario.pais = team.area?.name || '';
    }
  }

  // -------------------------------------------------------
  // Envía el formulario: crea o actualiza según el modo
  // -------------------------------------------------------
  guardar(): void {
    this.errorMessage  = '';
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

  // -------------------------------------------------------
  // Activa el modo edición cargando los datos del favorito.
  // También pre-carga los equipos de la liga guardada para
  // que el select de equipos esté disponible.
  // -------------------------------------------------------
  editar(favorito: Favorito): void {
    this.formulario = { ...favorito };
    this.editando   = true;
    this.errorMessage  = '';
    this.successMessage = '';

    // Buscamos el código de la liga guardada para poder cargar sus equipos
    const comp = this.competitions.find(c => c.name === favorito.liga);
    if (comp) {
      this.selectedLigaCode = comp.code;
      this.cargarEquipos(comp.code);
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

  // Resetea el formulario y limpia los selects dinámicos
  cancelar(): void {
    this.formulario        = this.formularioVacio();
    this.editando          = false;
    this.selectedLigaCode  = '';
    this.equipos           = [];
  }
}
