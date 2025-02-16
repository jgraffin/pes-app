import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonFooter,
  IonHeader,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ModalComponent } from '../components/modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonFooter,
    CommonModule,
    ModalComponent,
  ],
})
export class HomePage implements AfterViewInit, OnInit {
  isModalLoaded = false;

  constructor() {}

  ngOnInit(): void {
    this.isModalLoaded = false;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isModalLoaded = true;
    }, 2000);
  }
}
