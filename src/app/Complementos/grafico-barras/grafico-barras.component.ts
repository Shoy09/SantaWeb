import { Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-grafico-barras',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './grafico-barras.component.html',
  styleUrl: './grafico-barras.component.scss'
})
export class GraficoBarrasComponent {
  @Input() datos: any[] = [];
}
