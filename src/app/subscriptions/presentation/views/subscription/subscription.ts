import {Component, inject, signal} from '@angular/core';
import {DatePipe, LowerCasePipe} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule, MatError} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

import {SubscriptionStore} from '../../../application/subscription-store';
import {PlanEntity} from '../../../domain/model/plan-entity';

@Component({
  selector: 'app-subscription',
  imports: [
    DatePipe, LowerCasePipe, ReactiveFormsModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatError, MatInputModule, MatTableModule, MatProgressSpinner,
  ],
  templateUrl: './subscription.html',
  styleUrl: './subscription.css',
})
export class Subscription {
  readonly store = inject(SubscriptionStore);
  private fb = inject(FormBuilder);

  readonly showRenewForm = signal(false);
  paymentColumns = ['processedAt', 'amount', 'status'];

  renewForm = this.fb.group({
    months: new FormControl<number>(1, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
  });

  isCurrentPlan(plan: PlanEntity): boolean {
    return this.store.effectivePlan()?.id === plan.id;
  }

  subscribe(planId: number): void {
    this.store.subscribeToPlan(planId, true);
  }

  switchTo(planId: number): void {
    this.store.changePlan(planId);
  }

  cancel(): void {
    this.store.cancel();
  }

  toggleRenewForm(): void {
    this.showRenewForm.update(v => !v);
  }

  renew(): void {
    if (this.renewForm.invalid) return;
    this.store.renew(this.renewForm.value.months!);
    this.showRenewForm.set(false);
  }
}
