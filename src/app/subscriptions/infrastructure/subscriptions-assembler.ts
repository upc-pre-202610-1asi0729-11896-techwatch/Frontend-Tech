import {PlanEntity} from '../domain/model/plan-entity';
import {SubscriptionEntity} from '../domain/model/subscription-entity';
import {PaymentEntity} from '../domain/model/payment-entity';
import {PaymentResource, PlanResource, SubscriptionResource} from './subscriptions-resources';

export class SubscriptionsAssembler {

  static toPlan(resource: PlanResource): PlanEntity {
    return new PlanEntity(resource);
  }

  static toSubscription(resource: SubscriptionResource): SubscriptionEntity {
    return new SubscriptionEntity(resource);
  }

  static toPayment(resource: PaymentResource): PaymentEntity {
    return new PaymentEntity(resource);
  }
}
