import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ============================================================
// FOOTBALL SERVICE
// Centraliza todas las llamadas a la API externa football-data.org.
// El token de autenticación lo añade automáticamente el interceptor
// footballInterceptor, por lo que aquí solo construimos las URLs.
// ============================================================
@Injectable({
  providedIn: 'root'
})
export class FootballService {

  private apiUrl = environment.footballApiUrl;

  constructor(private http: HttpClient) {}

  // -------------------------------------------------------
  // Obtener partidos de una competición filtrados por estado
  // @param competitionCode: código de la liga (PD, PL, BL1, SA, FL1, CL)
  // @param status: FINISHED | SCHEDULED | IN_PLAY
  // -------------------------------------------------------
  getMatchesByCompetition(competitionCode: string, status: string = 'FINISHED'): Observable<any> {
    const url = `${this.apiUrl}/competitions/${competitionCode}/matches?status=${status}`;
    return this.http.get(url);
  }

  // -------------------------------------------------------
  // Obtener los equipos de una competición
  // -------------------------------------------------------
  getTeamsByCompetition(competitionCode: string): Observable<any> {
    const url = `${this.apiUrl}/competitions/${competitionCode}/teams`;
    return this.http.get(url);
  }

  // -------------------------------------------------------
  // Obtener los últimos partidos de un equipo por su ID
  // -------------------------------------------------------
  getMatchesByTeam(teamId: number): Observable<any> {
    const url = `${this.apiUrl}/teams/${teamId}/matches?status=FINISHED&limit=10`;
    return this.http.get(url);
  }
}
