import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './login/login.component';
import { AppSideRegisterComponent } from './register/register.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full', // Asegúrate de que coincida completamente con la URL vacía
    redirectTo: 'login', // Redirecciona a la ruta 'login' por defecto
  },
  {
    path: 'login',
    component: AppSideLoginComponent,
  },
  {
    path: 'register',
    component: AppSideRegisterComponent,
  },
  // Otras rutas si las tienes...
];

