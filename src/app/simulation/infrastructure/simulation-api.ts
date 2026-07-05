import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs';

import {BaseApi} from '../../shared/interface/base-api';
import {toFriendlyError} from '../../shared/infrastructure/http-error';
import {environment} from '../../../environments/environment';
import {SimulationSessionEntity} from '../domain/model/simulation-session-entity';
import {
  RecordDeviceActionRequest,
  SimulationSessionResource,
  StartSimulationSessionRequest,
} from './simulation-session-resource';
import {SimulationSessionAssembler} from './simulation-session-assembler';

@Injectable({
  providedIn: 'root',
})
export class SimulationApi extends BaseApi {
  private readonly endpointUrl = `${environment.apiBaseUrl}${environment.simulationSessionsEndpointPath}`;

  constructor(private http: HttpClient) {
    super();
  }

  /** GET /simulation-sessions/active?userId — resolves to null when there is none (404). */
  getActiveByUserId(userId: number): Observable<SimulationSessionEntity | null> {
    return this.http.get<SimulationSessionResource>(`${this.endpointUrl}/active?userId=${userId}`).pipe(
      map(resource => SimulationSessionAssembler.toEntityFromResource(resource)),
      catchError((error: HttpErrorResponse) =>
        error.status === 404 ? of(null) : this.handleError('Failed to fetch active session')(error)
      )
    );
  }

  start(userId: number, propertyId: number): Observable<SimulationSessionEntity> {
    const body: StartSimulationSessionRequest = {userId, propertyId};
    return this.http.post<SimulationSessionResource>(this.endpointUrl, body).pipe(
      map(resource => SimulationSessionAssembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to start simulation session'))
    );
  }

  recordAction(sessionId: number, body: RecordDeviceActionRequest): Observable<SimulationSessionEntity> {
    return this.http.post<SimulationSessionResource>(`${this.endpointUrl}/${sessionId}/actions`, body).pipe(
      map(resource => SimulationSessionAssembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to record device action'))
    );
  }

  end(sessionId: number): Observable<SimulationSessionEntity> {
    return this.http.post<SimulationSessionResource>(`${this.endpointUrl}/${sessionId}/end`, {}).pipe(
      map(resource => SimulationSessionAssembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to end simulation session'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => throwError(() => toFriendlyError(operation, error));
  }
}
