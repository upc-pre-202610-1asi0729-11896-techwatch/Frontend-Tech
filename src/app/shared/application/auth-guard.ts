import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

import {AuthStore} from '../../iam/application/auth-store';

/** Blocks access to the protected areas of the app when there is no active session. */
export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  return authStore.isAuthenticated() || router.createUrlTree(['/auth/login']);
};
