import {Component, effect, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {MatFormFieldModule, MatError} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TranslatePipe} from '@ngx-translate/core';

import {AuthStore} from '../../../application/auth-store';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatError, MatInputModule, MatButtonModule, MatProgressSpinner, TranslatePipe,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(AuthStore);

  readonly justRegistered = this.route.snapshot.queryParamMap.has('registered');

  form = this.fb.group({
    email: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
  });

  constructor() {
    effect(() => {
      if (this.store.isAuthenticated()) this.router.navigateByUrl('/');
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.store.signIn(this.form.value.email!, this.form.value.password!);
  }
}
