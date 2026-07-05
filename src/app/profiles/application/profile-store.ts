import {inject, Injectable, signal} from '@angular/core';

import {SessionStore} from '../../shared/application/session-store';
import {ProfileEntity} from '../domain/model/profile-entity';
import {ProfilesApi} from '../infrastructure/profiles-api';

/**
 * Application store for the Profiles context: the profile (and preferences)
 * of the current user.
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileStore {
  private readonly profilesApi = inject(ProfilesApi);
  private readonly session = inject(SessionStore);

  private readonly profileSignal = signal<ProfileEntity | null>(null);
  readonly profile = this.profileSignal.asReadonly();

  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.profilesApi.getByUserId(this.session.userId).subscribe({
      next: profile => {
        this.profileSignal.set(profile);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load profile'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateProfile(firstName: string, lastName: string, phoneNumber: string, profileImageUrl: string): void {
    const current = this.profileSignal();
    if (!current) return;
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.profilesApi.update(current.id, {firstName, lastName, phoneNumber, profileImageUrl}).subscribe({
      next: updated => {
        this.profileSignal.set(updated);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update profile'));
        this.loadingSignal.set(false);
      }
    });
  }

  updatePreferences(language: string, theme: string, notificationsEnabled: boolean): void {
    const current = this.profileSignal();
    if (!current) return;
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.profilesApi.updatePreferences(current.id, {language, theme, notificationsEnabled}).subscribe({
      next: updated => {
        this.profileSignal.set(updated);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update preferences'));
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
