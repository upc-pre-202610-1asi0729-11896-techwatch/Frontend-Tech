import {BaseEntity} from '../../../shared/interface/base-entity';

/** User preferences, embedded in the Profile aggregate. */
export interface Preferences {
  language: string;
  theme: string;
  notificationsEnabled: boolean;
}

/** User profile aggregate root. Auto-created by the backend on sign-up. */
export class ProfileEntity implements BaseEntity {
  private _id: number;
  private _userId: number;
  private _firstName: string;
  private _lastName: string;
  private _phoneNumber: string;
  private _profileImageUrl: string;
  private _preferences: Preferences;

  constructor(profile: {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    profileImageUrl: string;
    preferences: Preferences;
  }) {
    this._id = profile.id;
    this._userId = profile.userId;
    this._firstName = profile.firstName;
    this._lastName = profile.lastName;
    this._phoneNumber = profile.phoneNumber;
    this._profileImageUrl = profile.profileImageUrl;
    this._preferences = profile.preferences;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get userId(): number { return this._userId; }
  set userId(value: number) { this._userId = value; }

  get firstName(): string { return this._firstName; }
  set firstName(value: string) { this._firstName = value; }

  get lastName(): string { return this._lastName; }
  set lastName(value: string) { this._lastName = value; }

  get phoneNumber(): string { return this._phoneNumber; }
  set phoneNumber(value: string) { this._phoneNumber = value; }

  get profileImageUrl(): string { return this._profileImageUrl; }
  set profileImageUrl(value: string) { this._profileImageUrl = value; }

  get preferences(): Preferences { return this._preferences; }
  set preferences(value: Preferences) { this._preferences = value; }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`.trim();
  }
}
