import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, Signal, signal, ViewChild } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, airplane, archive, close } from 'ionicons/icons';
import { Team, TeamsService } from 'src/app/services/teams.service';

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
    ReactiveFormsModule,
    JsonPipe,
  ],
})
export class ModalComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal!: IonModal;
  @ViewChild('teamModal', { static: false }) teamModal!: IonModal;

  greetingTitle = 'Bem-vindo,';
  greetingMessage = `Para começar, adicione o nome de </br>cada jogador
  com seu respectivo time.`;
  formTitle = 'Adicionar jogador';

  formData!: FormGroup;
  teams = signal<Team[]>([]);
  shield!: any;

  constructor(private fb: FormBuilder, private teamsService: TeamsService) {
    addIcons({
      'add-circle-outline': addCircleOutline,
    });
    addIcons({
      archive: archive,
      airplane: airplane,
      close: close,
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
    const imagePath = `assets/shield/${item.id}.png`;

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
    return item?.id.toString();
  }

  selectTeam(item: { name: string; id: string }) {
    this.formData.patchValue({ team: item.name });
    this.teamModal.dismiss();
    this.shield = item;
  }

  onSubmit() {
    if (this.formData.valid) {
      console.log('Form Submitted:', this.formData.value);
    }
  }

  onModalDismiss() {
    this.formData.reset();
    this.modal.dismiss();
  }

  onModalDismissTeams() {
    this.teamModal.dismiss();
  }
}
