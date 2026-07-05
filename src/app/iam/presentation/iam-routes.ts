import {Routes} from '@angular/router';

const login = () => import('./views/login/login').then(m => m.Login);
const register = () => import('./views/register/register').then(m => m.Register);

export const iamRoutes: Routes = [
  {path: 'login', loadComponent: login},
  {path: 'register', loadComponent: register},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
];
