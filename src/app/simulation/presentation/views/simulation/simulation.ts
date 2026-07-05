import {Component, computed, effect, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule, MatError} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {TranslatePipe} from '@ngx-translate/core';

import {SimulationStore} from '../../../application/simulation-store';
import {ManagementStore} from '../../../../management/application/management-store';

@Component({
  selector: 'app-simulation',
  imports: [
    DatePipe, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatError,
    MatSelectModule, MatInputModule, MatTableModule, MatProgressSpinner, TranslatePipe,
  ],
  templateUrl: './simulation.html',
  styleUrl: './simulation.css',
})
export class Simulation {
  readonly store = inject(SimulationStore);
  readonly managementStore = inject(ManagementStore);
  private fb = inject(FormBuilder);

  readonly actionTypes = ['TURN_ON', 'TURN_OFF', 'ADJUST'];

  /** Property chosen to start a new session (when none is active). */
  readonly selectedPropertyId = signal<number | null>(null);

  /** Property the active session runs on, resolved from the loaded properties. */
  readonly sessionProperty = computed(() => {
    const session = this.store.activeSession();
    return session ? this.managementStore.getPropertyById(session.propertyId)() : undefined;
  });

  actionColumns = ['executedAt', 'deviceId', 'actionType'];
  usageColumns = ['recordedAt', 'deviceId', 'consumptionValue'];

  actionForm = this.fb.group({
    deviceId: new FormControl<number | null>(null, {validators: [Validators.required]}),
    actionType: new FormControl<string>('TURN_ON', {nonNullable: true, validators: [Validators.required]}),
    durationMinutes: new FormControl<number>(30, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
  });

  constructor() {
    // Load the devices of the active session's property so they can be acted on.
    effect(() => {
      const property = this.sessionProperty();
      if (property) this.managementStore.loadDevicesForProperty(property);
    });
  }

  startSession() {
    const propertyId = this.selectedPropertyId();
    if (propertyId) this.store.startSession(propertyId);
  }

  recordAction() {
    if (this.actionForm.invalid) return;
    this.store.recordAction(
      this.actionForm.value.deviceId!,
      this.actionForm.value.actionType!,
      this.actionForm.value.durationMinutes!,
    );
  }

  endSession() {
    this.store.endSession();
  }
}
