// Importaciones de Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Variables de entorno con la URL y clave de la API
import { environment } from '../../environments/environment';

// Injectable hace que este servicio esté disponible en toda la app
// sin necesidad de declararlo en ningún módulo
@Injectable({
  providedIn: 'root'
})
export class FootballService {

  // URL base de la API (viene del entorno)
  private apiUrl = environment.footballApiUrl;

  // Cabeceras HTTP requeridas por football-data.org
  // El token de autenticación va en la cabecera 'X-Auth-Token'
  private headers = new HttpHeaders({
    'X-Auth-Token': environment.footballApiKey
  });

  // Inyectamos HttpClient para poder hacer peticiones HTTP
  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  // Obtener los partidos de una competición concreta
  // @param competitionCode: código de la liga (ej: 'PD' para LaLiga, 'PL' para Premier)
  // @param status: filtro por estado del partido (FINISHED, SCHEDULED, LIVE)
  // Devuelve un Observable con los datos de la API
  // -------------------------------------------------------
  getMatchesByCompetition(competitionCode: string, status: string = 'FINISHED'): Observable<any> {
    const url = `${this.apiUrl}/competitions/${competitionCode}/matches?status=${status}`;
    return this.http.get(url, { headers: this.headers });
  }

  // -------------------------------------------------------
  // Obtener los equipos de una competición
  // @param competitionCode: código de la liga
  // -------------------------------------------------------
  getTeamsByCompetition(competitionCode: string): Observable<any> {
    const url = `${this.apiUrl}/competitions/${competitionCode}/teams`;
    return this.http.get(url, { headers: this.headers });
  }

  // -------------------------------------------------------
  // Obtener los últimos partidos de un equipo por su ID
  // @param teamId: ID numérico del equipo en la API
  // -------------------------------------------------------
  getMatchesByTeam(teamId: number): Observable<any> {
    const url = `${this.apiUrl}/teams/${teamId}/matches?status=FINISHED&limit=10`;
    return this.http.get(url, { headers: this.headers });
  }
}
