import {Component, effect, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {MatFormFieldModule, MatError} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TranslatePipe} from '@ngx-translate/core';

import {AuthStore} from '../../../application/auth-store';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatError, MatInputModule, MatButtonModule, MatProgressSpinner, TranslatePipe,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  readonly store = inject(AuthStore);

  form = this.fb.group({
    firstName: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    lastName: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    email: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.minLength(8)]}),
  });

  constructor() {
    effect(() => {
      if (this.store.signUpSuccess()) this.router.navigate(['/auth/login'], {queryParams: {registered: 'true'}});
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.store.signUp(
      this.form.value.email!,
      this.form.value.password!,
      this.form.value.firstName!,
      this.form.value.lastName!,
    );
  }
}
