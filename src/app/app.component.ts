import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LoadingRandomPlayersService } from './services/loading-random-players.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, NgIf],
  standalone: true,
})
export class AppComponent {
  loadingService = inject(LoadingService);
  loadingRandomPlayersService = inject(LoadingRandomPlayersService);
}
