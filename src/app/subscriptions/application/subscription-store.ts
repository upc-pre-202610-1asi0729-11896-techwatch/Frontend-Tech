import {computed, inject, Injectable, signal} from '@angular/core';

import {SessionStore} from '../../shared/application/session-store';
import {PlanEntity} from '../domain/model/plan-entity';
import {SubscriptionEntity} from '../domain/model/subscription-entity';
import {PaymentEntity} from '../domain/model/payment-entity';
import {SubscriptionsApi} from '../infrastructure/subscriptions-api';

/**
 * Application store for the Subscriptions context: the freemium plan
 * catalog, the current user's subscription (if any) and its payments.
 *
 * Users without an active subscription are on the FREE plan by default
 * (mirrors the backend's SubscriptionsContextFacade.fetchPlanForUser).
 */
@Injectable({
  providedIn: 'root',
})
export class SubscriptionStore {
  private readonly subscriptionsApi = inject(SubscriptionsApi);
  private readonly session = inject(SessionStore);

  private readonly plansSignal = signal<PlanEntity[]>([]);
  readonly plans = this.plansSignal.asReadonly();

  private readonly subscriptionSignal = signal<SubscriptionEntity | null>(null);
  readonly subscription = this.subscriptionSignal.asReadonly();

  private readonly paymentsSignal = signal<PaymentEntity[]>([]);
  readonly payments = this.paymentsSignal.asReadonly();

  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  /** The plan behind the active subscription, if any. */
  readonly currentPlan = computed(() => {
    const subscription = this.subscriptionSignal();
    return subscription ? this.plansSignal().find(p => p.id === subscription.planId) ?? null : null;
  });

  /** The plan that actually applies to the user: their subscription's plan, or FREE. */
  readonly effectivePlan = computed(() =>
    this.currentPlan() ?? this.plansSignal().find(p => p.type === 'FREE') ?? null
  );

  constructor() {
    this.loadPlans();
    this.loadSubscription();
  }

  hasFeature(feature: 'advancedMetrics' | 'customReports' | 'alerts' | 'unlimitedHistory'): boolean {
    const plan = this.effectivePlan();
    if (!plan) return false;
    switch (feature) {
      case 'advancedMetrics': return plan.hasAdvancedMetrics;
      case 'customReports': return plan.hasCustomReports;
      case 'alerts': return plan.hasAlerts;
      case 'unlimitedHistory': return plan.hasUnlimitedHistory;
    }
  }

  loadPlans(): void {
    this.subscriptionsApi.getPlans().subscribe({
      next: plans => this.plansSignal.set(plans),
      error: err => this.errorSignal.set(this.formatError(err, 'Failed to load plans')),
    });
  }

  loadSubscription(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.subscriptionsApi.getByUserId(this.session.userId).subscribe({
      next: subscription => {
        this.subscriptionSignal.set(subscription);
        this.loadingSignal.set(false);
        if (subscription) this.loadPayments(subscription.id);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load subscription'));
        this.loadingSignal.set(false);
      }
    });
  }

  loadPayments(subscriptionId: number): void {
    this.subscriptionsApi.getPayments(subscriptionId).subscribe({
      next: payments => this.paymentsSignal.set(payments),
      error: err => this.errorSignal.set(this.formatError(err, 'Failed to load payments')),
    });
  }

  subscribeToPlan(planId: number, autoRenew: boolean): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.subscriptionsApi.create({userId: this.session.userId, planId, autoRenew}).subscribe({
      next: subscription => {
        this.subscriptionSignal.set(subscription);
        this.loadingSignal.set(false);
        this.loadPayments(subscription.id);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to subscribe'));
        this.loadingSignal.set(false);
      }
    });
  }

  changePlan(newPlanId: number): void {
    const subscription = this.subscriptionSignal();
    if (!subscription) return;
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.subscriptionsApi.changePlan(subscription.id, {newPlanId}).subscribe({
      next: updated => {
        this.subscriptionSignal.set(updated);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to change plan'));
        this.loadingSignal.set(false);
      }
    });
  }

  renew(months: number): void {
    const subscription = this.subscriptionSignal();
    if (!subscription) return;
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.subscriptionsApi.renew(subscription.id, {months}).subscribe({
      next: updated => {
        this.subscriptionSignal.set(updated);
        this.loadingSignal.set(false);
        this.loadPayments(updated.id);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to renew subscription'));
        this.loadingSignal.set(false);
      }
    });
  }

  cancel(): void {
    const subscription = this.subscriptionSignal();
    if (!subscription) return;
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.subscriptionsApi.cancel(subscription.id).subscribe({
      next: updated => {
        this.subscriptionSignal.set(updated);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to cancel subscription'));
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}
