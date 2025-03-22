import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../loading.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const token = localStorage.getItem('token');
  const excludedEndpoints = ['teams'];

  const isExcluded = excludedEndpoints.some((endpoint) =>
    req.url.includes(endpoint)
  );

  if (!isExcluded) {
    loadingService.show();
  }

  const modifiedReq =
    !isExcluded && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(modifiedReq).pipe(
    finalize(() => {
      if (!isExcluded) {
        loadingService.hide();
      }
    })
  );
};
