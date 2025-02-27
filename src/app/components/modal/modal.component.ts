import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  IonList,
  IonModal,
  IonSelect,
  IonSelectOption,
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
    IonButton,
    IonIcon,
    IonContent,
    IonModal,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
  ],
})
export class ModalComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal!: IonModal;

  greetingTitle = 'Bem-vindo,';
  greetingMessage = `Para começar, adicione o nome de </br>cada jogador
  com seu respectivo time.`;
  formTitle = 'Adicionar jogador';

  formData!: FormGroup;

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
  }

  initializeForm() {
    this.formData = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      team: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      console.log('Form Submitted:', this.formData.value);
    }
  }

  closeModal() {
    this.modal.dismiss();
  }

  onModalDismiss() {
    this.formData.reset();
  }
}
