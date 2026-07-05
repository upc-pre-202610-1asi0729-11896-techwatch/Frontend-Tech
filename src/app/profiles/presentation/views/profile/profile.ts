import {Component, effect, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {MatFormFieldModule, MatError} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TranslatePipe} from '@ngx-translate/core';

import {ProfileStore} from '../../../application/profile-store';
import {AuthStore} from '../../../../iam/application/auth-store';
import {LanguageStore} from '../../../../shared/application/language-store';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatError, MatInputModule,
    MatSelectModule, MatSlideToggleModule, MatButtonModule, MatProgressSpinner, TranslatePipe,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  readonly store = inject(ProfileStore);
  readonly authStore = inject(AuthStore);
  private readonly languageStore = inject(LanguageStore);
  private fb = inject(FormBuilder);

  /** Language names are shown in their own language, so they are not translated. */
  readonly languages = [
    {value: 'en', label: 'English'},
    {value: 'es', label: 'Español'},
  ];
  readonly themes = ['light', 'dark'] as const;

  profileForm = this.fb.group({
    firstName: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    lastName: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    phoneNumber: new FormControl<string>('', {nonNullable: true}),
    profileImageUrl: new FormControl<string>('', {nonNullable: true}),
  });

  preferencesForm = this.fb.group({
    language: new FormControl<string>('en', {nonNullable: true}),
    theme: new FormControl<string>('light', {nonNullable: true}),
    notificationsEnabled: new FormControl<boolean>(true, {nonNullable: true}),
  });

  constructor() {
    let patched = false;
    effect(() => {
      const profile = this.store.profile();
      if (profile && !patched) {
        this.profileForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phoneNumber: profile.phoneNumber,
          profileImageUrl: profile.profileImageUrl,
        });
        this.preferencesForm.patchValue(profile.preferences);
        patched = true;
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    const value = this.profileForm.getRawValue();
    this.store.updateProfile(value.firstName, value.lastName, value.phoneNumber, value.profileImageUrl);
  }

  savePreferences(): void {
    const value = this.preferencesForm.getRawValue();
    this.store.updatePreferences(value.language, value.theme, value.notificationsEnabled);
    this.languageStore.setLanguage(value.language);
  }
}
