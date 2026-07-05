import {Routes} from '@angular/router';

const profile = () => import('./views/profile/profile').then(m => m.Profile);

export const profileRoutes: Routes = [
  {path: '', loadComponent: profile},
];
