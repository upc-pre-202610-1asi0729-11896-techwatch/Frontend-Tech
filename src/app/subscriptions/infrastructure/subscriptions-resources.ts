import {BaseResource} from '../../shared/interface/base-resource';

export interface PlanResource extends BaseResource {
  id: number;
  name: string;
  type: string;
  priceAmount: number;
  priceCurrency: string;
  billingCycle: string;
  maxDevices: number;
  hasAdvancedMetrics: boolean;
  hasCustomReports: boolean;
  hasAlerts: boolean;
  hasUnlimitedHistory: boolean;
  isActive: boolean;
}

export interface SubscriptionResource extends BaseResource {
  id: number;
  userId: number;
  planId: number;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface PaymentResource extends BaseResource {
  id: number;
  subscriptionId: number;
  amount: number;
  currency: string;
  status: string;
  externalPaymentId: string;
  processedAt: string;
}

/** Request body for POST /subscriptions. */
export interface CreateSubscriptionRequest {
  userId: number;
  planId: number;
  autoRenew: boolean;
}

/** Request body for PUT /subscriptions/{id}/renew. */
export interface RenewSubscriptionRequest {
  months: number;
}

/** Request body for PUT /subscriptions/{id}/plan. */
export interface ChangeSubscriptionPlanRequest {
  newPlanId: number;
}
