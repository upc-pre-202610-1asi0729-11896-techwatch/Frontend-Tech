import {BaseEntity} from '../../../shared/interface/base-entity';

export type PlanType = 'FREE' | 'PREMIUM';
export type BillingCycle = 'MONTHLY' | 'YEARLY';

/** A plan of the freemium catalog. Mirrors the backend Subscriptions `Plan` aggregate root. */
export class PlanEntity implements BaseEntity {
  private _id: number;
  private _name: string;
  private _type: string;
  private _priceAmount: number;
  private _priceCurrency: string;
  private _billingCycle: string;
  private _maxDevices: number;
  private _hasAdvancedMetrics: boolean;
  private _hasCustomReports: boolean;
  private _hasAlerts: boolean;
  private _hasUnlimitedHistory: boolean;
  private _isActive: boolean;

  constructor(plan: {
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
  }) {
    this._id = plan.id;
    this._name = plan.name;
    this._type = plan.type;
    this._priceAmount = plan.priceAmount;
    this._priceCurrency = plan.priceCurrency;
    this._billingCycle = plan.billingCycle;
    this._maxDevices = plan.maxDevices;
    this._hasAdvancedMetrics = plan.hasAdvancedMetrics;
    this._hasCustomReports = plan.hasCustomReports;
    this._hasAlerts = plan.hasAlerts;
    this._hasUnlimitedHistory = plan.hasUnlimitedHistory;
    this._isActive = plan.isActive;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get type(): string { return this._type; }
  set type(value: string) { this._type = value; }

  get priceAmount(): number { return this._priceAmount; }
  set priceAmount(value: number) { this._priceAmount = value; }

  get priceCurrency(): string { return this._priceCurrency; }
  set priceCurrency(value: string) { this._priceCurrency = value; }

  get billingCycle(): string { return this._billingCycle; }
  set billingCycle(value: string) { this._billingCycle = value; }

  get maxDevices(): number { return this._maxDevices; }
  set maxDevices(value: number) { this._maxDevices = value; }

  get hasAdvancedMetrics(): boolean { return this._hasAdvancedMetrics; }
  set hasAdvancedMetrics(value: boolean) { this._hasAdvancedMetrics = value; }

  get hasCustomReports(): boolean { return this._hasCustomReports; }
  set hasCustomReports(value: boolean) { this._hasCustomReports = value; }

  get hasAlerts(): boolean { return this._hasAlerts; }
  set hasAlerts(value: boolean) { this._hasAlerts = value; }

  get hasUnlimitedHistory(): boolean { return this._hasUnlimitedHistory; }
  set hasUnlimitedHistory(value: boolean) { this._hasUnlimitedHistory = value; }

  get isActive(): boolean { return this._isActive; }
  set isActive(value: boolean) { this._isActive = value; }
}
