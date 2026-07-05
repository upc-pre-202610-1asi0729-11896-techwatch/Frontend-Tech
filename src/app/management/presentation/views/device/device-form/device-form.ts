import {Component, effect, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';

import {ManagementStore} from '../../../../application/management-store';
import {DeviceEntity, DeviceType} from '../../../../domain/models/device/device-entity';

@Component({
  selector: 'app-device-form',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './device-form.html',
  styleUrl: './device-form.css',
})
export class DeviceForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(ManagementStore);

  readonly deviceTypes: DeviceType[] = ['LIGHT', 'THERMOSTAT', 'CAMERA', 'SMART_PLUG', 'AIR_CONDITIONER', 'DOOR_LOCK'];

  readonly propertyId = +this.route.snapshot.params['propertyId'];
  readonly spaceId = +this.route.snapshot.params['spaceId'];
  deviceId: number | null = this.route.snapshot.params['deviceId'] ? +this.route.snapshot.params['deviceId'] : null;
  isEdit = this.deviceId !== null;

  form = this.fb.group({
    name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    brand: new FormControl<string>('', {nonNullable: true}),
    model: new FormControl<string>('', {nonNullable: true}),
    type: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    powerWatts: new FormControl<number>(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
  });

  constructor() {
    if (this.isEdit && this.deviceId) {
      // Devices for this space may not be loaded yet (e.g. on a hard refresh).
      this.store.loadDevicesBySpace(this.spaceId);
      const device = this.store.getDeviceById(this.deviceId);
      let patched = false;
      effect(() => {
        const found = device();
        if (found && !patched) {
          this.patchForm(found);
          patched = true;
        }
      });
    }
  }

  submit() {
    if (this.form.invalid) return;

    const device = new DeviceEntity({
      id: this.deviceId ?? 0,
      spaceId: this.spaceId,
      name: this.form.value.name!,
      brand: this.form.value.brand ?? '',
      model: this.form.value.model ?? '',
      type: this.form.value.type!,
      status: 'OFF',
      powerWatts: this.form.value.powerWatts!,
    });

    if (this.isEdit) {
      this.store.updateDevice(device);
    } else {
      this.store.addDevice(device);
    }

    this.back();
  }

  back() {
    this.router.navigate(['/management/properties', this.propertyId]);
  }

  private patchForm(device: DeviceEntity): void {
    this.form.patchValue({
      name: device.name,
      brand: device.brand,
      model: device.model,
      type: device.type,
      powerWatts: device.powerWatts,
    });
  }
}
