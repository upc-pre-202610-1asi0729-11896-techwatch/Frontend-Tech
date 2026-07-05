import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

import {AuthStore} from '../../../../iam/application/auth-store';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatMenuModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);

  logout(): void {
    this.authStore.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
