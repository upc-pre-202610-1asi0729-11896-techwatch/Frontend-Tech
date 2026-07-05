import {Component, effect, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule, MatError} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

import {AnalyticsStore} from '../../../application/analytics.store';
import {ManagementStore} from '../../../../management/application/management-store';
import {SessionStore} from '../../../../shared/application/session-store';
import {SubscriptionStore} from '../../../../subscriptions/application/subscription-store';

@Component({
  selector: 'app-reports',
  imports: [
    DatePipe, RouterLink, ReactiveFormsModule, MatFormFieldModule, MatError, MatSelectModule,
    MatInputModule, MatButtonModule, MatExpansionModule, MatTableModule, MatProgressSpinner,
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {
  readonly store = inject(AnalyticsStore);
  readonly managementStore = inject(ManagementStore);
  readonly session = inject(SessionStore);
  readonly subscriptionStore = inject(SubscriptionStore);
  private fb = inject(FormBuilder);

  itemColumns = ['deviceName', 'consumption', 'usageFrequency'];

  form = this.fb.group({
    startDate: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    endDate: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
  });

  constructor() {
    effect(() => {
      const propertyId = this.session.selectedPropertyId();
      if (propertyId) this.store.loadReports(propertyId);
    });
  }

  selectProperty(propertyId: number): void {
    this.session.selectProperty(propertyId);
  }

  generate(): void {
    const propertyId = this.session.selectedPropertyId();
    if (!propertyId || this.form.invalid) return;
    // The backend expects LocalDateTime; expand the date inputs to full-day bounds.
    const start = `${this.form.value.startDate}T00:00:00`;
    const end = `${this.form.value.endDate}T23:59:59`;
    this.store.generateReport(propertyId, start, end);
  }
}
