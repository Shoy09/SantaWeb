import { Routes } from '@angular/router';

// ui

import { AppReportesComponent } from './reportes/reportes.component';
import { AppUsuarioComponent } from './usuario/usuario.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reporte',
        component: AppReportesComponent,
      },
      {
        path: 'usuario',
        component: AppUsuarioComponent,
      },
    ],
  },
];
