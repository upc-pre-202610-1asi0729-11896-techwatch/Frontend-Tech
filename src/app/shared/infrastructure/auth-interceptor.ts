import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';

import {AuthStore} from '../../iam/application/auth-store';

/**
 * Attaches the JWT (Authorization: Bearer) to every request except the public
 * authentication endpoints, and logs the user out on a 401 (expired/invalid
 * token or missing session).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const isAuthEndpoint = req.url.includes('/authentication/');
  const token = authStore.token();

  const authorizedReq = (!isAuthEndpoint && token)
    ? req.clone({setHeaders: {Authorization: `Bearer ${token}`}})
    : req;

  return next(authorizedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint) {
        authStore.logout();
        router.navigateByUrl('/auth/login');
      }
      return throwError(() => error);
    })
  );
};
