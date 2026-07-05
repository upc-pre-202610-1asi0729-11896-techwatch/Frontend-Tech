import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs';

import {BaseApi} from '../../shared/interface/base-api';
import {toFriendlyError} from '../../shared/infrastructure/http-error';
import {environment} from '../../../environments/environment';
import {AuthenticatedUserResource, SignInRequest, SignUpRequest, UserResource} from './iam-resources';

/**
 * IAM endpoints. Sign-up/sign-in are public on the backend (no Bearer token
 * required); getUser requires an authenticated session.
 */
@Injectable({
  providedIn: 'root',
})
export class IamApi extends BaseApi {
  private readonly authUrl = `${environment.apiBaseUrl}${environment.authenticationEndpointPath}`;
  private readonly usersUrl = `${environment.apiBaseUrl}${environment.usersEndpointPath}`;

  constructor(private http: HttpClient) {
    super();
  }

  signUp(request: SignUpRequest): Observable<UserResource> {
    return this.http.post<UserResource>(`${this.authUrl}/sign-up`, request).pipe(
      catchError(this.handleError('Failed to sign up'))
    );
  }

  signIn(request: SignInRequest): Observable<AuthenticatedUserResource> {
    return this.http.post<AuthenticatedUserResource>(`${this.authUrl}/sign-in`, request).pipe(
      catchError(this.handleError('Failed to sign in'))
    );
  }

  getUser(id: number): Observable<UserResource> {
    return this.http.get<UserResource>(`${this.usersUrl}/${id}`).pipe(
      catchError(this.handleError('Failed to fetch user'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => throwError(() => toFriendlyError(operation, error));
  }
}
