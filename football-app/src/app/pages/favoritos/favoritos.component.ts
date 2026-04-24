import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { Favorito } from '../../models/favorito.model';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss'
})
export class FavoritosComponent implements OnInit {

  // Lista de favoritos que viene de la API
  favoritos: Favorito[] = [];

  // Objeto que enlaza con los campos del formulario
  // Cuando editamos, cargamos aquí los datos del registro seleccionado
  formulario: Favorito = this.formularioVacio();

  // true = estamos editando un registro existente / false = creando uno nuevo
  editando: boolean = false;

  // Mensajes para el usuario
  errorMessage:  string = '';
  successMessage: string = '';

  // Indica si se está esperando respuesta de la API
  loading: boolean = false;

  constructor(private favoritosService: FavoritosService, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('FutResult — Favoritos');
    this.cargarFavoritos();
  }

  // -------------------------------------------------------
  // Devuelve un objeto Favorito vacío para resetear el formulario
  // -------------------------------------------------------
  formularioVacio(): Favorito {
    return { equipo: '', liga: '', pais: '', nota: '' };
  }

  // -------------------------------------------------------
  // Llama al servicio para obtener todos los favoritos
  // y los guarda en el array favoritos
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
  // Envía el formulario: crea o actualiza según editando
  // -------------------------------------------------------
  guardar(): void {
    this.errorMessage  = '';
    this.successMessage = '';

    if (this.editando && this.formulario.id) {
      // UPDATE: enviamos PUT con el id y los nuevos datos
      this.favoritosService.update(this.formulario.id, this.formulario).subscribe({
        next: () => {
          this.successMessage = 'Favorito actualizado correctamente.';
          this.cancelar();
          this.cargarFavoritos();
        },
        error: () => { this.errorMessage = 'Error al actualizar el favorito.'; }
      });
    } else {
      // CREATE: enviamos POST sin id
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
  // Rellena el formulario con los datos del favorito elegido
  // y activa el modo edición
  // -------------------------------------------------------
  editar(favorito: Favorito): void {
    // Copiamos el objeto para no modificar la lista directamente
    this.formulario = { ...favorito };
    this.editando = true;
    this.errorMessage  = '';
    this.successMessage = '';
  }

  // -------------------------------------------------------
  // Pide confirmación y borra el favorito seleccionado
  // -------------------------------------------------------
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

  // -------------------------------------------------------
  // Cancela la edición y resetea el formulario al estado inicial
  // -------------------------------------------------------
  cancelar(): void {
    this.formulario = this.formularioVacio();
    this.editando   = false;
  }
}
