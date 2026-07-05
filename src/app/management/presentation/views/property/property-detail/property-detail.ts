import {Component, computed, effect, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatError} from '@angular/material/form-field';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';

import {ManagementStore} from '../../../../application/management-store';

@Component({
  selector: 'app-property-detail',
  imports: [
    RouterLink, MatButtonModule, MatTableModule, MatError, MatProgressSpinner, MatIcon,
  ],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.css',
})
export class PropertyDetail {
  readonly store = inject(ManagementStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly propertyId = signal<number>(+this.route.snapshot.params['propertyId']);
  readonly property = computed(() => this.store.getPropertyById(this.propertyId())());

  readonly selectedSpaceId = signal<number | null>(null);

  /** Whether the current store error is the device-limit business rule (backend message). */
  readonly isDeviceLimitError = computed(() => this.store.error()?.includes('plan allows a maximum') ?? false);

  displayedColumns = ['id', 'name', 'type', 'brand', 'powerWatts', 'status', 'actions'];

  constructor() {
    // When the property's spaces become available, default to the first one and
    // load its devices; reload devices whenever the selected space changes.
    effect(() => {
      const spaces = this.property()?.spaces ?? [];
      if (spaces.length && this.selectedSpaceId() === null) {
        this.selectedSpaceId.set(spaces[0].id);
      }
    });
    effect(() => {
      const spaceId = this.selectedSpaceId();
      if (spaceId) this.store.loadDevicesBySpace(spaceId);
    });
  }

  addSpace() {
    this.router.navigate(['/management/properties', this.propertyId(), 'spaces', 'new']);
  }

  addDevice() {
    const spaceId = this.selectedSpaceId();
    if (!spaceId) return;
    this.router.navigate(['/management/properties', this.propertyId(), 'spaces', spaceId, 'devices', 'new']);
  }

  editDevice(deviceId: number) {
    const spaceId = this.selectedSpaceId();
    if (!spaceId) return;
    this.router.navigate(['/management/properties', this.propertyId(), 'spaces', spaceId, 'devices', deviceId, 'edit']);
  }

  deleteDevice(id: number) {
    this.store.deleteDevice(id);
  }

  back() {
    this.router.navigate(['/management/properties']);
  }
}
