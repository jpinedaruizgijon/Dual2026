import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Favorito } from '../models/favorito.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  private apiUrl = `${environment.apiUrl}/favoritos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Favorito[]> {
    return this.http.get<Favorito[]>(this.apiUrl);
  }

  getById(id: number): Observable<Favorito> {
    return this.http.get<Favorito>(`${this.apiUrl}/${id}`);
  }

  create(favorito: Favorito): Observable<Favorito> {
    return this.http.post<Favorito>(this.apiUrl, favorito);
  }

  update(id: number, favorito: Favorito): Observable<Favorito> {
    return this.http.put<Favorito>(`${this.apiUrl}/${id}`, favorito);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
