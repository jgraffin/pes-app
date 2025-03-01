import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, airplane, archive, close } from 'ionicons/icons';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
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
  teams: Array<{ id: string; name: string }> = [];

  constructor(private fb: FormBuilder) {
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
    this.teams = [
      { id: 'psg', name: 'Paris Saint German' },
      { id: 'real-madrid', name: 'Real Madrid' },
      { id: 'barcelona', name: 'Barcelona' },
      { id: 'man-city', name: 'Manchester City' },
    ];
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

  selectTeam(item: { name: string }) {
    this.formData.patchValue({ team: item.name });
    this.teamModal.dismiss();
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
