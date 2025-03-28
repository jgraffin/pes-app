import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingRandomPlayersService } from '../loading-random-players.service';
import { LoadingService } from '../loading.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const loadingRandomPlayersService = inject(LoadingRandomPlayersService);

  const token = localStorage.getItem('token');
  const excludedEndpoints = ['teams', 'random-players'];

  const isExcluded = excludedEndpoints.some((endpoint) =>
    req.url.includes(endpoint)
  );

  let isRandomPlayersRequest = req.url.includes('random-players');

  if (isRandomPlayersRequest) {
    loadingRandomPlayersService.show();
  } else if (!isExcluded) {
    loadingService.show();
  }

  const modifiedReq =
    !isExcluded && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(modifiedReq).pipe(
    finalize(() => {
      if (isRandomPlayersRequest) {
        loadingRandomPlayersService.hide();
      } else if (!isExcluded) {
        loadingService.hide();
      }
    })
  );
};
