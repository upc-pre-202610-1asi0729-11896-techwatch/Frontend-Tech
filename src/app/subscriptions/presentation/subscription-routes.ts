import {Routes} from '@angular/router';

const subscription = () => import('./views/subscription/subscription').then(m => m.Subscription);

export const subscriptionRoutes: Routes = [
  {path: '', loadComponent: subscription},
];
