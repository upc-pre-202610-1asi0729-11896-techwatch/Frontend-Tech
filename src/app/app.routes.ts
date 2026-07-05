import { Routes } from '@angular/router';

import { authGuard } from './shared/application/auth-guard';

const iamRoutes = () => import('./iam/presentation/iam-routes').then(m => m.iamRoutes);
const managementRoutes = () => import('./management/presentation/management-routes').then(m => m.managementRoutes);
const simulationRoutes = () => import('./simulation/presentation/simulation-routes').then(m => m.simulationRoutes);
const analyticsRoutes = () => import('./analytics/presentation/analytics.routes').then(m => m.analyticsRoutes);
const mainLayout = () => import('./shared/presentation/layout/main-layout/main-layout').then(m => m.MainLayout);

export const routes: Routes = [
  { path: 'auth', loadChildren: iamRoutes },
  {
    path: '',
    loadComponent: mainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'management', loadChildren: managementRoutes },
      { path: 'simulation', loadChildren: simulationRoutes },
      { path: 'analytics', loadChildren: analyticsRoutes },
      { path: '', redirectTo: 'management/properties', pathMatch: 'full' },
    ],
  },
];
