import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Favorito } from '../models/favorito.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  private readonly url = environment.favoritosUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Favorito[]> {
    return this.http.get<Favorito[]>(this.url);
  }

  getById(id: number): Observable<Favorito> {
    return this.http.get<Favorito>(`${this.url}?id=${id}`);
  }

  create(favorito: Favorito): Observable<Favorito> {
    return this.http.post<Favorito>(this.url, favorito);
  }

  update(id: number, favorito: Favorito): Observable<Favorito> {
    return this.http.put<Favorito>(`${this.url}?id=${id}`, favorito);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}?id=${id}`);
  }
}
