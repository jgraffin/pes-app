import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    NgClass,
  ],
})
export class ModalComponent implements OnInit {
  @ViewChild('registerModalRef', { static: false }) modal!: IonModal;
  @ViewChild('registerModalTeamRef', { static: false }) modalTeam!: IonModal;
  @Output() listPlayersEmitter = new EventEmitter();
  @Output() singlePlayerEmitter = new EventEmitter();

  @Input() player!: Player | undefined;
  @Input() players: Player[] = [];
  @Input() greetings?: {
    formTitle?: string;
    title?: string;
    message?: string;
    isEdit?: boolean;
  };

  formData!: FormGroup;

  teams = signal<Team[]>([]);
  thumbnail = signal<string>('');
  shield = signal<string>('');

  isToastOpen = false;
  isLoading = false;
  isUpdate = false;
  successfullyAdded = '';
  successfullyUpdated = '';
  teamId = '';

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
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
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
    this.loadTeams();

    if (!this.greetings) {
      return;
    }

    if (value === 'addNew') {
      this.greetings.formTitle = 'Adicionar JOGADOR';
      this.greetings.isEdit = false;

      this.player = undefined;
      this.singlePlayerEmitter.emit(this.player);
      this.formData.reset();
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

  trackById(index: number, item: { id: string }): string {
    return item?.id;
  }

  onModalDismiss() {
    this.player = undefined;
    this.singlePlayerEmitter.emit(this.player);
    this.modal.dismiss();
  }

  selectTeam(item: Team) {
    this.formData.patchValue({ team: item.name });
    this.thumbnail.set(`assets/shield/${item?.thumbnail}.svg`);
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
    };

    !this.player ? this.addPlayer(payload) : this.updatePlayer(payload);
  }

  addPlayer(payload: Player) {
    this.teamsService.addPlayer(payload).subscribe((added) => {
      this.isToastOpen = false;
      this.isUpdate = false;
      setTimeout(() => (this.isToastOpen = true), 10);

      this.successfullyAdded = `Jogador ${added?.name.toUpperCase()} foi adicionado!`;

      this.players = [...this.players, added];
      this.listPlayersEmitter.emit(this.players);

      this.updateValues(added);
    });
  }

  updatePlayer(payload: Partial<Player>) {
    if (!this.player) {
      return;
    }

    this.teamsService
      .updatePlayer(this.player.id, payload)
      .subscribe((updated) => {
        this.isToastOpen = false;
        this.isUpdate = true;
        setTimeout(() => (this.isToastOpen = true), 10);

        this.successfullyUpdated = `Jogador ${updated?.name.toUpperCase()} foi atualizado!`;

        this.updateValues(updated, this.isUpdate);
      });
  }

  updateValues(updatedPlayer: Player, isUpdate?: boolean) {
    if (isUpdate) {
      this.players = this.players.map((p) =>
        p.id === updatedPlayer.id ? updatedPlayer : p
      );

      this.listPlayersEmitter.emit(this.players);
    }

    const previousTeam = this.teams().find(
      (team) => team.name === this.player?.team
    );

    const newTeam = this.teams().find(
      (team) => team.name === updatedPlayer.team
    );

    this.teamId = newTeam?.id;

    this.handlePreviousTeam(previousTeam);
    this.handleNotSelectedTeam(newTeam);

    this.player = undefined;
    this.formData.reset();
    this.modal.dismiss();
  }

  handlePreviousTeam(previousTeam: any) {
    if (previousTeam && previousTeam.id !== this.teamId) {
      const hasOtherPlayers = this.players.some(
        (p) => p.team === previousTeam.name
      );

      if (!hasOtherPlayers) {
        const resetPayload = { ...previousTeam, isSelected: false };
        this.teamsService.putTeams(previousTeam.id, resetPayload).subscribe();
      }
    }
  }

  handleNotSelectedTeam(newTeam: any) {
    if (newTeam && !newTeam.isSelected) {
      const payloadTeam = {
        ...newTeam,
        isSelected: true,
      };

      this.teamsService
        .putTeams(newTeam.id, payloadTeam)
        .subscribe((teams) => this.teams.set(teams));
    }
  }

  get name() {
    return this.formData.get('name') as FormControl;
  }

  get team() {
    return this.formData.get('team') as FormControl;
  }
}
