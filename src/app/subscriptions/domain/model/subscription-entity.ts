import {BaseEntity} from '../../../shared/interface/base-entity';

export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

/** A user's subscription to a plan. Mirrors the backend `Subscription` aggregate root. */
export class SubscriptionEntity implements BaseEntity {
  private _id: number;
  private _userId: number;
  private _planId: number;
  private _status: string;
  private _startDate: string;
  private _endDate: string;
  private _autoRenew: boolean;

  constructor(subscription: {
    id: number;
    userId: number;
    planId: number;
    status: string;
    startDate: string;
    endDate: string;
    autoRenew: boolean;
  }) {
    this._id = subscription.id;
    this._userId = subscription.userId;
    this._planId = subscription.planId;
    this._status = subscription.status;
    this._startDate = subscription.startDate;
    this._endDate = subscription.endDate;
    this._autoRenew = subscription.autoRenew;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get userId(): number { return this._userId; }
  set userId(value: number) { this._userId = value; }

  get planId(): number { return this._planId; }
  set planId(value: number) { this._planId = value; }

  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }

  get startDate(): string { return this._startDate; }
  set startDate(value: string) { this._startDate = value; }

  get endDate(): string { return this._endDate; }
  set endDate(value: string) { this._endDate = value; }

  get autoRenew(): boolean { return this._autoRenew; }
  set autoRenew(value: boolean) { this._autoRenew = value; }
}
