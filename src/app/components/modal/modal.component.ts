import { JsonPipe, NgFor, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
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
  @ViewChild('modal', { static: true }) modal!: IonModal;
  @ViewChild('teamModal', { static: false }) teamModal!: IonModal;
  @Output() playersEmitter = new EventEmitter();

  @Input() players: Player[] = [];
  @Input() greetings?: {
    formTitle?: string;
    title?: string;
    message?: string;
  };

  formData!: FormGroup;

  teams = signal<Team[]>([]);
  shield!: Team;
  isToastOpen = false;
  isLoading = false;
  playerSuccessfullyAddedMessage = '';

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

  initializeForm() {
    this.formData = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      team: ['', [Validators.required]],
    });
  }

  loadTeams() {
    this.teamsService.getTeams().subscribe((teams) => {
      this.teams.set(teams);
    });
  }

  getTeamImagePath(item: Team): Signal<string> {
    const defaultImage = 'assets/icon/favicon.png';
    const imagePath = `assets/shield/${item.id}.svg`;

    const img = new Image();
    img.src = imagePath;

    return signal(
      img.complete && img.naturalWidth !== 0 ? imagePath : defaultImage
    );
  }

  openTeamModal() {
    if (!this.teamModal) {
      console.error('teamModal is not defined!');
      return;
    }

    this.teamModal.present();
  }

  trackById(index: number, item: any): string {
    return item?.id;
  }

  onModalDismiss() {
    this.modal.dismiss();
  }

  onModalDismissTeams() {
    this.teamModal.dismiss();
  }

  selectTeam(item: { name: string; id: string }) {
    this.formData.patchValue({ team: item.name });
    this.teamModal.dismiss();
    this.shield = item;
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

    this.teamsService.addPlayer(payload).subscribe((value) => {
      this.modal.dismiss();
      this.isLoading = true;

      if (value.id) {
        setTimeout(() => {
          this.isToastOpen = true;
          this.playerSuccessfullyAddedMessage = `Jogador ${value.name.toUpperCase()} adicionado com sucesso!`;
        }, 1000);

        this.isToastOpen = false;
        this.players = [...this.players, value];
        this.playersEmitter.emit(this.players);
        this.formData.reset();
      }
    });
  }
}
