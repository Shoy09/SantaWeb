import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesRoutes } from './pages.routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { AppDashboardComponent } from './dashboard/dashboard.component';
import { SalesChartComponent } from "../Complementos/sales-chart/sales-chart.component";
import { TablasRendimientoComponent } from "../Complementos/tablas-rendimiento/tablas-rendimiento.component";
import { GraficoBarrasComponent } from "../Complementos/grafico-barras/grafico-barras.component";

@NgModule({
    declarations: [AppDashboardComponent],
    exports: [TablerIconsModule],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        NgApexchartsModule,
        RouterModule.forChild(PagesRoutes),
        TablerIconsModule.pick(TablerIcons),
        SalesChartComponent,
        TablasRendimientoComponent,
        GraficoBarrasComponent,
    ]
})
export class PagesModule {}
