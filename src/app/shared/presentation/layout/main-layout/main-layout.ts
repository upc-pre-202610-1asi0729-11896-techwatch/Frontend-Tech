import {Component, effect, inject} from '@angular/core';
import {UpperCasePipe} from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {TranslatePipe} from '@ngx-translate/core';

import {AuthStore} from '../../../../iam/application/auth-store';
import {LanguageStore, SUPPORTED_LANGUAGES} from '../../../application/language-store';
import {ProfileStore} from '../../../../profiles/application/profile-store';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatMenuModule, TranslatePipe, UpperCasePipe],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private readonly router = inject(Router);
  private readonly profileStore = inject(ProfileStore);
  readonly authStore = inject(AuthStore);
  readonly languageStore = inject(LanguageStore);

  readonly languages = SUPPORTED_LANGUAGES;

  constructor() {
    // Once the profile loads, adopt its saved language if it differs from the active one
    // (e.g. a different device where localStorage has no stored preference yet).
    let synced = false;
    effect(() => {
      const profile = this.profileStore.profile();
      if (profile && !synced) {
        this.languageStore.setLanguage(profile.preferences.language);
        synced = true;
      }
    });
  }

  logout(): void {
    this.authStore.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
