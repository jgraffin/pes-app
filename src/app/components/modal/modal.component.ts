import { JsonPipe, NgFor, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonText,
  IonThumbnail,
  IonToast,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  airplane,
  archive,
  checkmarkCircleOutline,
  close,
} from 'ionicons/icons';
import { Player, Team, TeamsService } from 'src/app/services/teams.service';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    IonThumbnail,
    IonButton,
    IonIcon,
    IonContent,
    IonModal,
    IonList,
    IonItem,
    IonInput,
    IonLabel,
    IonText,
    IonToast,
    ReactiveFormsModule,
    JsonPipe,
  ],
})
export class ModalComponent implements OnInit {
  @ViewChild('registerModalRef', { static: true }) modal!: IonModal;
  @ViewChild('registerModalTeamRef', { static: false }) modalTeam!: IonModal;
  @Output() listPlayersEmitter = new EventEmitter();
  @Output() singlePlayerEmitter = new EventEmitter();

  @Input() player!: any;
  @Input() players: Player[] = [];
  @Input() greetings?: {
    formTitle?: string;
    title?: string;
    message?: string;
  };

  formData!: FormGroup;

  teams = signal<Team[]>([]);
  thumbnail = signal<string>('');
  shield = signal<string>('');

  isToastOpen = false;
  isLoading = false;
  playerSuccessfullyAddedMessage = '';
  playerSuccessfullyUpdatedMessage = '';

  constructor(private fb: FormBuilder, private teamsService: TeamsService) {
    addIcons({
      archive: archive,
      airplane: airplane,
      close: close,
      addCircleOutline: addCircleOutline,
      checkmarkCircleOutline: checkmarkCircleOutline,
    });
  }

  ngOnInit() {
    this.initializeForm();
    this.loadTeams();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.player);
    if (this.player?.id !== undefined) {
      this.populateFormData(this.player);
      this.openModal('');
    }
  }

  initializeForm() {
    this.formData = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      team: ['', [Validators.required]],
      thumbnail: [''],
    });
  }

  openModal(value: string) {
    // if (value === 'addNew') {
    //   this.player = undefined;
    this.singlePlayerEmitter.emit(this.player);
    //   this.formData.reset();
    // }

    if (!this.modal) {
      return;
    }

    this.modal.present();
  }

  openTeamModal() {
    if (!this.modalTeam) {
      return;
    }

    this.modalTeam.present();
  }

  populateFormData(player: Player) {
    this.formData.reset();
    this.formData.patchValue({
      name: player?.name || '',
      team: player?.team || '',
      thumbnail: player?.thumbnail || '',
    });

    this.thumbnail.set(`assets/shield/${player?.thumbnail}.svg`);
  }

  loadTeams() {
    this.teamsService.getTeams().subscribe((teams) => {
      this.teams.set(teams);
    });
  }

  trackById(index: number, item: any): string {
    return item?.id;
  }

  onModalDismiss() {
    this.player = undefined;
    this.singlePlayerEmitter.emit(this.player);
    this.modal.dismiss();
  }

  onModalDismissTeams() {
    this.modalTeam.dismiss();
  }

  selectTeam(item: Team) {
    this.formData.patchValue({ team: item.name });
    this.thumbnail.set(`assets/shield/${item?.id}.svg`);
    this.modalTeam.dismiss();
  }

  slugifyTeam(value: string): string {
    return value.toLowerCase().replace(/\s+/g, '-');
  }

  onSubmit() {
    if (!this.formData.valid) {
      this.formData.markAllAsTouched();
      return;
    }

    const { team } = this.formData.value;

    const payload = {
      ...this.formData.value,
      thumbnail: this.slugifyTeam(team),
      createdAt: new Date().toISOString(),
    };

    if (!this.player) {
      this.teamsService.addPlayer(payload).subscribe((value) => {
        this.modal.dismiss();
        this.isLoading = true;

        if (value.id) {
          setTimeout(() => {
            this.isToastOpen = true;
            this.playerSuccessfullyAddedMessage = `Jogador ${value.name.toUpperCase()} adicionado com sucesso!`;
          }, 1000);

          const players = this.sortPlayers(value);
          this.updateValues(players);
        }
      });
    } else {
      this.teamsService
        .updatePlayer(this.player?.id, payload)
        .subscribe((value) => {
          if (value.id) {
            setTimeout(() => {
              this.isToastOpen = true;
              this.playerSuccessfullyUpdatedMessage = `Jogador ${value.name.toUpperCase()} atualizado com sucesso!`;
            }, 1000);

            const players = this.sortPlayers(value);
            this.updateValues(players);
          }
        });
    }
  }

  updateValues(list: Player[]) {
    this.listPlayersEmitter.emit(list);
    this.player = undefined;
    this.formData.reset();
    this.modal.dismiss();
  }

  sortPlayers(value: any) {
    return (this.players = this.players
      .map((player) => (player.id === value.id ? value : player))
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
  }

  get team() {
    return this.formData.get('team') as FormControl;
  }

  get name() {
    return this.formData.get('name') as FormControl;
  }
}
