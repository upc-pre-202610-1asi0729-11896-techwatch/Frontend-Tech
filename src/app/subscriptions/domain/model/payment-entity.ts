import {BaseEntity} from '../../../shared/interface/base-entity';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

/** A payment charged for a subscription. Mirrors the backend `Payment` aggregate root. */
export class PaymentEntity implements BaseEntity {
  private _id: number;
  private _subscriptionId: number;
  private _amount: number;
  private _currency: string;
  private _status: string;
  private _externalPaymentId: string;
  private _processedAt: string;

  constructor(payment: {
    id: number;
    subscriptionId: number;
    amount: number;
    currency: string;
    status: string;
    externalPaymentId: string;
    processedAt: string;
  }) {
    this._id = payment.id;
    this._subscriptionId = payment.subscriptionId;
    this._amount = payment.amount;
    this._currency = payment.currency;
    this._status = payment.status;
    this._externalPaymentId = payment.externalPaymentId;
    this._processedAt = payment.processedAt;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get subscriptionId(): number { return this._subscriptionId; }
  set subscriptionId(value: number) { this._subscriptionId = value; }

  get amount(): number { return this._amount; }
  set amount(value: number) { this._amount = value; }

  get currency(): string { return this._currency; }
  set currency(value: string) { this._currency = value; }

  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }

  get externalPaymentId(): string { return this._externalPaymentId; }
  set externalPaymentId(value: string) { this._externalPaymentId = value; }

  get processedAt(): string { return this._processedAt; }
  set processedAt(value: string) { this._processedAt = value; }
}
