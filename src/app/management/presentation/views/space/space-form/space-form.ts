import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';

import {ManagementStore} from '../../../../application/management-store';

@Component({
  selector: 'app-space-form',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './space-form.html',
  styleUrl: './space-form.css',
})
export class SpaceForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(ManagementStore);

  readonly propertyId = +this.route.snapshot.params['propertyId'];

  form = this.fb.group({
    name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    description: new FormControl<string>('', {nonNullable: true}),
  });

  submit() {
    if (this.form.invalid) return;
    this.store.addSpace(this.propertyId, this.form.value.name!, this.form.value.description ?? '');
    this.back();
  }

  back() {
    this.router.navigate(['/management/properties', this.propertyId]);
  }
}
