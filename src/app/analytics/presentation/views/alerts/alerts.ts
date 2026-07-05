import {Component, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatError} from '@angular/material/form-field';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TranslatePipe} from '@ngx-translate/core';

import {AnalyticsStore} from '../../../application/analytics.store';

@Component({
  selector: 'app-alerts',
  imports: [DatePipe, MatTableModule, MatButtonModule, MatError, MatProgressSpinner, TranslatePipe],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css',
})
export class Alerts {
  readonly store = inject(AnalyticsStore);

  displayedColumns = ['severity', 'message', 'currentValue', 'triggeredAt', 'actions'];

  markAsRead(id: number): void {
    this.store.markAlertAsRead(id);
  }
}
