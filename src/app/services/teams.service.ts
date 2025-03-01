import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Team {
  id: any;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private baseUrl = 'http://192.168.18.3:3000/teams';

  constructor(private http: HttpClient) {}

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.baseUrl);
  }

  getTeamById(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.baseUrl}/${id}`);
  }

  addTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(this.baseUrl, team);
  }

  updateTeam(id: string, team: Partial<Team>): Observable<Team> {
    return this.http.put<Team>(`${this.baseUrl}/${id}`, team);
  }

  deleteTeam(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
