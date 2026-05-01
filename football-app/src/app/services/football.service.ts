import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ============================================================
// FOOTBALL SERVICE
// En producción llama al proxy PHP (football.php) alojado en
// el mismo servidor, que reenvía la petición a football-data.org.
// En desarrollo llama directamente a la API con el proxy de Angular.
// ============================================================
@Injectable({
  providedIn: 'root'
})
export class FootballService {

  constructor(private http: HttpClient) {}

  getMatchesByCompetition(competitionCode: string, status: string = 'FINISHED'): Observable<any> {
    const url = `${environment.footballApiUrl}/competitions/${competitionCode}/matches`;
    return this.http.get(url, { params: { status } });
  }

  getTeamsByCompetition(competitionCode: string): Observable<any> {
    return this.http.get(`${environment.footballApiUrl}/competitions/${competitionCode}/teams`);
  }

  getMatchesByTeam(teamId: number): Observable<any> {
    return this.http.get(`${environment.footballApiUrl}/teams/${teamId}/matches`);
  }
}
