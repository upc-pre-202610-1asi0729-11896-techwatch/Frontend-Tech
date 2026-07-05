import {Component, computed, effect, inject} from '@angular/core';
import {MatFormFieldModule, MatError} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

import {AnalyticsStore} from '../../../application/analytics.store';
import {ManagementStore} from '../../../../management/application/management-store';
import {SessionStore} from '../../../../shared/application/session-store';

interface DeviceConsumptionRow {
  deviceId: number;
  deviceName: string;
  totalConsumption: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [MatFormFieldModule, MatError, MatSelectModule, MatTableModule, MatProgressSpinner, TranslatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly store = inject(AnalyticsStore);
  readonly managementStore = inject(ManagementStore);
  readonly session = inject(SessionStore);
  private readonly translateService = inject(TranslateService);

  displayedColumns = ['deviceName', 'totalConsumption'];

  readonly rows = computed((): DeviceConsumptionRow[] =>
    Array.from(this.store.metricsByDevice().entries()).map(([deviceId, total]) => ({
      deviceId,
      deviceName: this.deviceName(deviceId),
      totalConsumption: Math.round(total * 100) / 100,
    }))
  );

  constructor() {
    // Load metrics and the property's devices whenever the selected property changes.
    effect(() => {
      const propertyId = this.session.selectedPropertyId();
      if (propertyId) {
        this.store.loadMetrics(propertyId);
        const property = this.managementStore.getPropertyById(propertyId)();
        if (property) this.managementStore.loadDevicesForProperty(property);
      }
    });
  }

  selectProperty(propertyId: number): void {
    this.session.selectProperty(propertyId);
  }

  private deviceName(deviceId: number): string {
    if (!deviceId) return this.translateService.instant('analytics.dashboard.propertyLevel');
    const device = this.managementStore.propertyDevices().find(d => d.id === deviceId);
    return device?.name ?? this.translateService.instant('common.deviceFallback', {id: deviceId});
  }
}
