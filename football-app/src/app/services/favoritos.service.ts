// Importaciones de Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modelo e entorno
import { Favorito } from '../models/favorito.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  // Endpoint de favoritos en nuestra API propia (Laravel)
  private apiUrl = `${environment.apiUrl}/favoritos`;

  // Inyectamos HttpClient para las peticiones HTTP
  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  // GET /favoritos — Obtener todos los favoritos
  // -------------------------------------------------------
  getAll(): Observable<Favorito[]> {
    return this.http.get<Favorito[]>(this.apiUrl);
  }

  // -------------------------------------------------------
  // GET /favoritos/:id — Obtener un favorito por su ID
  // -------------------------------------------------------
  getById(id: number): Observable<Favorito> {
    return this.http.get<Favorito>(`${this.apiUrl}/${id}`);
  }

  // -------------------------------------------------------
  // POST /favoritos — Crear un nuevo favorito
  // @param favorito: objeto sin id (lo genera la base de datos)
  // -------------------------------------------------------
  create(favorito: Favorito): Observable<Favorito> {
    return this.http.post<Favorito>(this.apiUrl, favorito);
  }

  // -------------------------------------------------------
  // PUT /favoritos/:id — Actualizar un favorito existente
  // @param id: identificador del registro a modificar
  // @param favorito: objeto con los nuevos datos
  // -------------------------------------------------------
  update(id: number, favorito: Favorito): Observable<Favorito> {
    return this.http.put<Favorito>(`${this.apiUrl}/${id}`, favorito);
  }

  // -------------------------------------------------------
  // DELETE /favoritos/:id — Eliminar un favorito
  // @param id: identificador del registro a borrar
  // -------------------------------------------------------
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
