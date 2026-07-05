import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';

import {ManagementStore} from '../../../../application/management-store';
import {SessionStore} from '../../../../../shared/application/session-store';
import {PropertyEntity, PropertyType} from '../../../../domain/models/property/property-entity';

@Component({
  selector: 'app-property-form',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css',
})
export class PropertyForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(ManagementStore);
  private session = inject(SessionStore);

  readonly propertyTypes: PropertyType[] = ['HOUSE', 'APARTMENT'];

  form = this.fb.group({
    name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    address: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    type: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
  });

  submit() {
    if (this.form.invalid) return;

    const property = new PropertyEntity({
      id: 0,
      userId: this.session.userId,
      name: this.form.value.name!,
      address: this.form.value.address!,
      type: this.form.value.type!,
    });

    this.store.addProperty(property);
    this.router.navigate(['/management/properties']);
  }

  cancel() {
    this.router.navigate(['/management/properties']);
  }
}
