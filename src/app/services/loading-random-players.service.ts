import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingRandomPlayersService {
  isLoading = signal(false);

  show() {
    this.isLoading.set(true);
  }

  hide() {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 5000);
  }
}
