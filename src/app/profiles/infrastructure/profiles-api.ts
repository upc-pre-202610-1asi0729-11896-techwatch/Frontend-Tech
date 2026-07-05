import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs';

import {BaseApi} from '../../shared/interface/base-api';
import {toFriendlyError} from '../../shared/infrastructure/http-error';
import {environment} from '../../../environments/environment';
import {ProfileEntity} from '../domain/model/profile-entity';
import {ProfileResource, UpdatePreferencesRequest, UpdateProfileRequest} from './profile-resources';
import {ProfileAssembler} from './profile-assembler';

@Injectable({
  providedIn: 'root',
})
export class ProfilesApi extends BaseApi {
  private readonly profilesUrl = `${environment.apiBaseUrl}${environment.profilesEndpointPath}`;

  constructor(private http: HttpClient) {
    super();
  }

  /** GET /profiles?userId — resolves to null when the user has no profile yet (404). */
  getByUserId(userId: number): Observable<ProfileEntity | null> {
    return this.http.get<ProfileResource>(`${this.profilesUrl}?userId=${userId}`).pipe(
      map(ProfileAssembler.toEntity),
      catchError((error: HttpErrorResponse) =>
        error.status === 404 ? of(null) : this.handleError('Failed to fetch profile')(error)
      )
    );
  }

  update(profileId: number, request: UpdateProfileRequest): Observable<ProfileEntity> {
    return this.http.put<ProfileResource>(`${this.profilesUrl}/${profileId}`, request).pipe(
      map(ProfileAssembler.toEntity),
      catchError(this.handleError('Failed to update profile'))
    );
  }

  updatePreferences(profileId: number, request: UpdatePreferencesRequest): Observable<ProfileEntity> {
    return this.http.put<ProfileResource>(`${this.profilesUrl}/${profileId}/preferences`, request).pipe(
      map(ProfileAssembler.toEntity),
      catchError(this.handleError('Failed to update preferences'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => throwError(() => toFriendlyError(operation, error));
  }
}
