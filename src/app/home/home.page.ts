import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
export class HomePage implements AfterViewInit, OnInit {
  @Input() filledFormData!: FormGroup;

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

  constructor(private teamsService: TeamsService) {
    addIcons({
      create: create,
    });
  }

  ngOnInit(): void {
    this.teamsService.players$.subscribe((players) => {
      this.players = players.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      if (this.players.length === 0) {
        setTimeout(() => {
          this.isModalLoaded = true;
        }, 2000);
      }
    });

    this.teamsService.getPlayers().subscribe();
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.ngOnInit();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  loadPlayers(player: any) {
    setTimeout(() => {
      this.players = player;
    }, 1000);
  }

  onEdit(player: any) {
    this.player = player;
  }

  ngAfterViewInit(): void {
    console.log('this.players', this.players);
    if (this.players.length === 0) {
      setTimeout(() => {
        this.isModalLoaded = true;
      }, 2000);
    }
  }

  trackById(index: number, item: any): string {
    return item?.id;
  }
}
