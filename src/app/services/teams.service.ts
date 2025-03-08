import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Team {
  id: any;
  name: string;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  thumbnail: string;
}

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private baseUrl = 'http://192.168.18.3:3000';
  private teams = `${this.baseUrl}/teams`;
  private players = `${this.baseUrl}/players`;

  private playersSubject = new BehaviorSubject<Player[]>([]);
  players$ = this.playersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.teams);
  }

  getPlayers() {
    return this.http
      .get<Player[]>(this.players)
      .pipe(tap((players) => this.playersSubject.next(players)));
  }

  getPlayerById(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.players}/${id}`);
  }

  addPlayer(team: Team): Observable<Player> {
    return this.http.post<Player>(this.players, team);
  }

  updatePlayer(id: string, team: Partial<Player>): Observable<Player> {
    return this.http.put<Player>(`${this.players}/${id}`, team);
  }

  deletePlayer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.players}/${id}`);
  }
}
