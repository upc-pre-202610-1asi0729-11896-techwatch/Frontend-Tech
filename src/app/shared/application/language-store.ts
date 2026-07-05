import {inject, Injectable, signal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

const LANGUAGE_STORAGE_KEY = 'techwatch.language';
export const SUPPORTED_LANGUAGES = ['en', 'es'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/**
 * Holds the active UI language and keeps ngx-translate in sync. Reads the
 * last chosen language from localStorage on startup, defaulting to English.
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageStore {
  private readonly translateService = inject(TranslateService);

  private readonly languageSignal = signal<SupportedLanguage>(this.readInitialLanguage());
  readonly language = this.languageSignal.asReadonly();

  constructor() {
    this.translateService.use(this.languageSignal());
  }

  setLanguage(lang: string): void {
    if (!this.isSupported(lang) || lang === this.languageSignal()) return;
    this.languageSignal.set(lang);
    this.translateService.use(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }

  private isSupported(lang: string): lang is SupportedLanguage {
    return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);
  }

  private readInitialLanguage(): SupportedLanguage {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored && this.isSupported(stored) ? stored : 'en';
  }
}
