import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonThumbnail,
  IonToast,
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
    IonItem,
    IonLabel,
    IonThumbnail,
    IonButtons,
    IonButton,
    IonRefresher,
    IonRefresherContent,
    IonToast,
    CommonModule,
    ModalComponent,
  ],
  animations: [
    trigger('fadeInFromRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate(
          '500ms 2s ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
  ],
})
export class HomePage implements OnInit {
  isModalLoaded = false;
  isToastOpen = false;
  hasPlayers = false;
  players: Player[] = [];
  player!: string;
  isLoaded = false;

  greetings = {
    title: 'Bem-vindo,',
    message: `Para começar, adicione o nome de </br>cada jogador
    com seu respectivo time.`,
    formTitle: 'Adicionar JOGADOR',
    isEdit: false,
  };

  successfullyDeleted = '';

  private playerSubject = new BehaviorSubject<Player[]>([]);
  player$ = this.playerSubject.asObservable();

  constructor(
    private teamsService: TeamsService,
    private cdRef: ChangeDetectorRef,
    private alertController: AlertController
  ) {
    addIcons({
      create: create,
    });
  }

  ngOnInit(): void {
    this.teamsService.players$.subscribe((players) => {
      this.players = players;
      this.isLoaded = true;
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
    this.greetings.formTitle = `Editar JOGADOR`;
    this.greetings.isEdit = true;
  }

  async onDelete(player: any) {
    const currentPlayer = player;

    const alert = await this.alertController.create({
      header: 'EXCLUIR JOGADOR',
      message: `Deseja excluir ${currentPlayer.name.toUpperCase()}?`,
      translucent: true,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          role: 'confirm',
          handler: () => {
            this.teamsService.deletePlayer(player.id).subscribe(() => {
              this.isToastOpen = false;
              this.cdRef.detectChanges();
              setTimeout(() => (this.isToastOpen = true), 10);

              this.successfullyDeleted = `Jogador ${currentPlayer.name.toUpperCase()} foi excluído!`;

              this.updateTeams(player);
            });
          },
        },
      ],
    });

    await alert.present();
  }

  updateTeams(player: Player) {
    this.players = this.players.filter((p) => p.id !== player.id);
    this.cdRef.detectChanges();

    const hasOtherPlayers = this.players.some((p) => p.team === player.team);

    if (!hasOtherPlayers) {
      this.teamsService.getTeams().subscribe((teams) => {
        const team = teams.find((t) => t.name === player.team);

        if (team) {
          const resetPayload = { ...team, isSelected: false };

          this.teamsService.putTeams(team.id, resetPayload).subscribe();
        }
      });
    }
  }

  trackById(index: number, item: { id: string }): string {
    return item?.id;
  }
}
