import {inject, Injectable, signal} from '@angular/core';

import {AuthStore} from '../../iam/application/auth-store';

/**
 * Holds session-scoped state that the rest of the app needs but that does not
 * belong to any single bounded context.
 */
@Injectable({
  providedIn: 'root',
})
export class SessionStore {
  private readonly authStore = inject(AuthStore);

  /** Id of the signed-in user. */
  get userId(): number {
    return this.authStore.userId();
  }

  private readonly selectedPropertyIdSignal = signal<number | null>(null);
  /** Property currently in focus for analytics and simulation views. */
  readonly selectedPropertyId = this.selectedPropertyIdSignal.asReadonly();

  selectProperty(propertyId: number | null): void {
    this.selectedPropertyIdSignal.set(propertyId);
  }
}
