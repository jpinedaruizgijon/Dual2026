import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private readonly API = 'https://restcountries.com/v3.1';

  constructor(private http: HttpClient) {}

  // "England" no existe en REST Countries — se mapea a "United Kingdom"
  private readonly ALIAS: Record<string, string> = {
    'England':  'United Kingdom',
    'Scotland': 'United Kingdom',
    'Wales':    'United Kingdom',
  };

  getFlagUrl(countryName: string): Observable<string> {
    const nombre = this.ALIAS[countryName] ?? countryName;
    const url = `${this.API}/name/${encodeURIComponent(nombre)}?fields=name,flags`;
    return this.http.get<any[]>(url).pipe(
      map(data => data[0]?.flags?.svg || data[0]?.flags?.png || ''),
      catchError(() => of(''))
    );
  }

  getCountryInfo(countryName: string): Observable<any> {
    const nombre = this.ALIAS[countryName] ?? countryName;
    const url = `${this.API}/name/${encodeURIComponent(nombre)}?fields=name,flags,capital,population,region`;
    return this.http.get<any[]>(url).pipe(
      map(data => data[0] ?? null),
      catchError(() => of(null))
    );
  }
}
