import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonThumbnail,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create } from 'ionicons/icons';
import { BehaviorSubject } from 'rxjs';
import { ModalComponent } from '../components/modal/modal.component';
import { Player, TeamsService } from '../services/teams.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonList,
    IonIcon,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonButtons,
    IonButton,
    IonRefresher,
    IonRefresherContent,
    CommonModule,
    ModalComponent,
  ],
})
export class HomePage implements OnInit {
  isModalLoaded = false;
  hasPlayers = false;
  players: Player[] = [];
  player!: string;

  greetings = {
    title: 'Bem-vindo,',
    message: `Para começar, adicione o nome de </br>cada jogador
    com seu respectivo time.`,
    formTitle: 'Adicionar jogador',
  };

  private playerSubject = new BehaviorSubject<Player[]>([]);
  player$ = this.playerSubject.asObservable();

  constructor(
    private teamsService: TeamsService,
    private cdRef: ChangeDetectorRef
  ) {
    addIcons({
      create: create,
    });
  }

  ngOnInit(): void {
    this.teamsService.players$.subscribe((players) => {
      this.players = players;
      this.cdRef.detectChanges();
    });
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.teamsService.getPlayers().subscribe();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  onEdit(player: any) {
    this.player = player;
  }

  trackById(index: number, item: any): string {
    return item?.id;
  }

  updateList(updatedPlayers: Player[]) {
    this.players = [...updatedPlayers];
  }
}
