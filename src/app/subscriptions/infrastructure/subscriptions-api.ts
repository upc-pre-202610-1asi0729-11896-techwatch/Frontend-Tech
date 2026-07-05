import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs';

import {BaseApi} from '../../shared/interface/base-api';
import {toFriendlyError} from '../../shared/infrastructure/http-error';
import {environment} from '../../../environments/environment';
import {PlanEntity} from '../domain/model/plan-entity';
import {SubscriptionEntity} from '../domain/model/subscription-entity';
import {PaymentEntity} from '../domain/model/payment-entity';
import {
  ChangeSubscriptionPlanRequest,
  CreateSubscriptionRequest,
  PaymentResource,
  PlanResource,
  RenewSubscriptionRequest,
  SubscriptionResource,
} from './subscriptions-resources';
import {SubscriptionsAssembler} from './subscriptions-assembler';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsApi extends BaseApi {
  private readonly plansUrl = `${environment.apiBaseUrl}${environment.plansEndpointPath}`;
  private readonly subscriptionsUrl = `${environment.apiBaseUrl}${environment.subscriptionsEndpointPath}`;

  constructor(private http: HttpClient) {
    super();
  }

  getPlans(): Observable<PlanEntity[]> {
    return this.http.get<PlanResource[]>(this.plansUrl).pipe(
      map(resources => resources.map(SubscriptionsAssembler.toPlan)),
      catchError(this.handleError('Failed to fetch plans'))
    );
  }

  /** GET /subscriptions?userId — resolves to null when the user has no subscription (404). */
  getByUserId(userId: number): Observable<SubscriptionEntity | null> {
    return this.http.get<SubscriptionResource>(`${this.subscriptionsUrl}?userId=${userId}`).pipe(
      map(SubscriptionsAssembler.toSubscription),
      catchError((error: HttpErrorResponse) =>
        error.status === 404 ? of(null) : this.handleError('Failed to fetch subscription')(error)
      )
    );
  }

  create(request: CreateSubscriptionRequest): Observable<SubscriptionEntity> {
    return this.http.post<SubscriptionResource>(this.subscriptionsUrl, request).pipe(
      map(SubscriptionsAssembler.toSubscription),
      catchError(this.handleError('Failed to create subscription'))
    );
  }

  renew(subscriptionId: number, request: RenewSubscriptionRequest): Observable<SubscriptionEntity> {
    return this.http.put<SubscriptionResource>(`${this.subscriptionsUrl}/${subscriptionId}/renew`, request).pipe(
      map(SubscriptionsAssembler.toSubscription),
      catchError(this.handleError('Failed to renew subscription'))
    );
  }

  cancel(subscriptionId: number): Observable<SubscriptionEntity> {
    return this.http.put<SubscriptionResource>(`${this.subscriptionsUrl}/${subscriptionId}/cancel`, {}).pipe(
      map(SubscriptionsAssembler.toSubscription),
      catchError(this.handleError('Failed to cancel subscription'))
    );
  }

  changePlan(subscriptionId: number, request: ChangeSubscriptionPlanRequest): Observable<SubscriptionEntity> {
    return this.http.put<SubscriptionResource>(`${this.subscriptionsUrl}/${subscriptionId}/plan`, request).pipe(
      map(SubscriptionsAssembler.toSubscription),
      catchError(this.handleError('Failed to change plan'))
    );
  }

  getPayments(subscriptionId: number): Observable<PaymentEntity[]> {
    return this.http.get<PaymentResource[]>(`${this.subscriptionsUrl}/${subscriptionId}/payments`).pipe(
      map(resources => resources.map(SubscriptionsAssembler.toPayment)),
      catchError(this.handleError('Failed to fetch payments'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => throwError(() => toFriendlyError(operation, error));
  }
}
