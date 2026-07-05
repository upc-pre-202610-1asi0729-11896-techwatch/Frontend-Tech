import {BaseEntity} from '../../../shared/interface/base-entity';

export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

/** Registered user account. Mirrors the backend IAM `User` aggregate root. */
export class UserEntity implements BaseEntity {
  private _id: number;
  private _email: string;
  private _role: string;

  constructor(user: { id: number; email: string; role: string }) {
    this._id = user.id;
    this._email = user.email;
    this._role = user.role;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get role(): string { return this._role; }
  set role(value: string) { this._role = value; }
}
