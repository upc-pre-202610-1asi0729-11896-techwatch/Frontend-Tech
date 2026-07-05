import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs';

import {BaseApi} from '../../shared/interface/base-api';
import {toFriendlyError} from '../../shared/infrastructure/http-error';
import {environment} from '../../../environments/environment';
import {ConsumptionMetric} from '../domain/model/consumption-metric.entity';
import {ConsumptionAlert} from '../domain/model/consumption-alert.entity';
import {ConsumptionReport} from '../domain/model/consumption-report.entity';
import {
  ConsumptionAlertResource,
  ConsumptionMetricResource,
  ConsumptionReportResource,
  GenerateReportRequest,
} from './analytics-resources';
import {AnalyticsAssembler} from './analytics-assembler';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsApi extends BaseApi {
  private readonly metricsUrl = `${environment.apiBaseUrl}${environment.metricsEndpointPath}`;
  private readonly alertsUrl = `${environment.apiBaseUrl}${environment.alertsEndpointPath}`;
  private readonly reportsUrl = `${environment.apiBaseUrl}${environment.reportsEndpointPath}`;

  constructor(private http: HttpClient) {
    super();
  }

  // Metrics
  getMetricsByPropertyId(propertyId: number): Observable<ConsumptionMetric[]> {
    return this.http.get<ConsumptionMetricResource[]>(`${this.metricsUrl}?propertyId=${propertyId}`).pipe(
      map(resources => resources.map(AnalyticsAssembler.toMetric)),
      catchError(this.handleError('Failed to fetch metrics'))
    );
  }

  // Alerts
  getAlertsByUserId(userId: number): Observable<ConsumptionAlert[]> {
    return this.http.get<ConsumptionAlertResource[]>(`${this.alertsUrl}?userId=${userId}`).pipe(
      map(resources => resources.map(AnalyticsAssembler.toAlert)),
      catchError(this.handleError('Failed to fetch alerts'))
    );
  }

  markAlertAsRead(alertId: number): Observable<ConsumptionAlert> {
    return this.http.put<ConsumptionAlertResource>(`${this.alertsUrl}/${alertId}/read`, {}).pipe(
      map(AnalyticsAssembler.toAlert),
      catchError(this.handleError('Failed to mark alert as read'))
    );
  }

  // Reports
  getReportsByPropertyId(propertyId: number): Observable<ConsumptionReport[]> {
    return this.http.get<ConsumptionReportResource[]>(`${this.reportsUrl}?propertyId=${propertyId}`).pipe(
      map(resources => resources.map(AnalyticsAssembler.toReport)),
      catchError(this.handleError('Failed to fetch reports'))
    );
  }

  generateReport(request: GenerateReportRequest): Observable<ConsumptionReport> {
    return this.http.post<ConsumptionReportResource>(this.reportsUrl, request).pipe(
      map(AnalyticsAssembler.toReport),
      catchError(this.handleError('Failed to generate report'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => throwError(() => toFriendlyError(operation, error));
  }
}
