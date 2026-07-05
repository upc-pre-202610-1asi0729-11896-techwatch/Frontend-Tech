import {computed, inject, Injectable, signal} from '@angular/core';

import {IamApi} from '../infrastructure/iam-api';

const AUTH_STORAGE_KEY = 'techwatch.auth';

interface StoredSession {
  id: number;
  email: string;
  token: string;
}

/**
 * Application store for the IAM context: the current session (user id, email
 * and JWT), persisted in localStorage so it survives page reloads.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly iamApi = inject(IamApi);

  private readonly idSignal = signal<number | null>(null);
  private readonly emailSignal = signal<string | null>(null);
  private readonly tokenSignal = signal<string | null>(null);

  readonly userId = computed(() => this.idSignal() ?? 0);
  readonly email = this.emailSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);

  private readonly signUpSuccessSignal = signal(false);
  readonly signUpSuccess = this.signUpSuccessSignal.asReadonly();

  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    this.restoreSession();
  }

  signUp(email: string, password: string, firstName: string, lastName: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.signUpSuccessSignal.set(false);
    this.iamApi.signUp({email, password, firstName, lastName}).subscribe({
      next: () => {
        this.signUpSuccessSignal.set(true);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to sign up'));
        this.loadingSignal.set(false);
      }
    });
  }

  signIn(email: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.signIn({email, password}).subscribe({
      next: authenticated => {
        this.persistSession(authenticated.id, authenticated.email, authenticated.token);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to sign in'));
        this.loadingSignal.set(false);
      }
    });
  }

  logout(): void {
    this.idSignal.set(null);
    this.emailSignal.set(null);
    this.tokenSignal.set(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  private persistSession(id: number, email: string, token: string): void {
    this.idSignal.set(id);
    this.emailSignal.set(email);
    this.tokenSignal.set(token);
    const stored: StoredSession = {id, email, token};
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stored));
  }

  private restoreSession(): void {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return;
    try {
      const stored = JSON.parse(raw) as StoredSession;
      this.idSignal.set(stored.id);
      this.emailSignal.set(stored.email);
      this.tokenSignal.set(stored.token);
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  private formatError(error: any, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
