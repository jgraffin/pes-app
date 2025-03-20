import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

export interface Team {
  id: any;
  name: string;
  thumbnail: string;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  thumbnail: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private baseUrl = 'http://192.168.18.3:5156';
  private teams = `${this.baseUrl}/teams`;
  private players = `${this.baseUrl}/players`;

  private playersSubject = new BehaviorSubject<Player[]>([]);
  players$ = this.playersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPlayers();
  }

  private loadPlayers(): void {
    this.http.get<Player[]>(this.players).subscribe((players) => {
      this.playersSubject.next(players);
    });
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.teams);
  }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.players).pipe(
      tap((players) => {
        this.playersSubject.next(players);
      })
    );
  }

  getPlayerById(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.players}/${id}`);
  }

  addPlayer(player: Player): Observable<any> {
    return this.http.post<Player>(this.players, player).pipe(
      tap((newPlayer) => {
        this.playersSubject.next([...this.playersSubject.value, newPlayer]);
        player;
      })
    );
  }

  updatePlayer(id: string, player: Partial<Player>): Observable<any> {
    return this.http.put<Player>(`${this.players}/${id}`, player);
  }

  deletePlayer(id: string): Observable<any> {
    return this.http.delete<void>(`${this.players}/${id}`).pipe(
      switchMap(() => this.http.get<Player[]>(this.players)),
      tap((players) => this.playersSubject.next(players))
    );
  }
}
