import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// ============================================================
// COUNTRIES SERVICE
// Consume la API pública restcountries.com desde el navegador.
// No requiere API key y tiene CORS habilitado.
// Se usa para obtener la bandera del país de cada equipo favorito.
// ============================================================
@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private readonly API = 'https://restcountries.com/v3.1';

  constructor(private http: HttpClient) {}

  // Algunos países de la API de fútbol usan nombres distintos a restcountries
  private readonly ALIAS: Record<string, string> = {
    'England':  'United Kingdom',
    'Scotland': 'United Kingdom',
    'Wales':    'United Kingdom',
  };

  // Devuelve la URL de la bandera SVG del país o '' si no se encuentra
  getFlagUrl(countryName: string): Observable<string> {
    const nombre = this.ALIAS[countryName] ?? countryName;
    const url = `${this.API}/name/${encodeURIComponent(nombre)}?fields=name,flags`;
    return this.http.get<any[]>(url).pipe(
      map(data => data[0]?.flags?.svg || data[0]?.flags?.png || ''),
      catchError(() => of(''))
    );
  }

  // Devuelve información completa del país: bandera, capital, población y región
  getCountryInfo(countryName: string): Observable<any> {
    const nombre = this.ALIAS[countryName] ?? countryName;
    const url = `${this.API}/name/${encodeURIComponent(nombre)}?fields=name,flags,capital,population,region`;
    return this.http.get<any[]>(url).pipe(
      map(data => data[0] ?? null),
      catchError(() => of(null))
    );
  }
}
