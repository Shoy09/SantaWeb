import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApexChart, ApexDataLabels, ApexLegend, ApexStroke, ApexTooltip, ApexAxisChartSeries, ApexXAxis, ApexYAxis, ApexGrid, ApexPlotOptions, ApexFill, ApexMarkers, NgApexchartsModule } from 'ng-apexcharts';
import { ImporteDetalle } from 'src/app/data/ImporteDetalle';
import descripciones from '../../json/Descripciones.json';


export interface SalesOverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}
interface ChartDataPoint {
  x: string;
  y: number;
  idlabor: string;
}


@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss']
})
export class SalesChartComponent implements OnChanges {
  @Input() salesData!: ImporteDetalle[];
  public salesOverviewChart: Partial<SalesOverviewChart> | any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['salesData'] && this.salesData) {
      this.processData(this.salesData);
    }
  }

  processData(data: ImporteDetalle[]) {
    const series: { name: string, data: ChartDataPoint[], color: string }[] = [
      { name: 'Jornal', data: [], color: '#5D87FF' },
      { name: 'Destajo', data: [], color: '#49BEFF' }
    ];
    const categories: string[] = [];
  
    let maxEarnings = 0;
    let maxExpenses = 0;
  
    data.forEach(item => {
      let earnings = 0;
      let expenses = 0;
      let hasNonZeroData = false;
  
      item.detalle.forEach(detail => {
        const cantidad = parseFloat(detail.cantidad);
        if (cantidad !== 0) {
          console.log(`idlabor: ${detail.idlabor}, cantidad: ${cantidad}`);
          hasNonZeroData = true;
          if (item.tipo_envio === 'H') {
            earnings += cantidad;
          } else {
            expenses += cantidad;
          }
        }
      });
  
      if (hasNonZeroData) {
        categories.push(item.fecha);
  
        const earningDetail = item.detalle.find(d => parseFloat(d.cantidad) === earnings);
        const expenseDetail = item.detalle.find(d => parseFloat(d.cantidad) === expenses);
  
        series[0].data.push({ x: item.fecha, y: earnings, idlabor: earningDetail?.idlabor || '' });
        series[1].data.push({ x: item.fecha, y: expenses, idlabor: expenseDetail?.idlabor || '' });
  
        if (earnings > maxEarnings) {
          maxEarnings = earnings;
        }
  
        if (expenses > maxExpenses) {
          maxExpenses = expenses;
        }
      }
    });
  
    const maxY = Math.max(maxEarnings, maxExpenses) * 1.1; // Add some padding
  
    this.salesOverviewChart = {
      series: series,
      grid: {
        borderColor: 'rgba(0,0,0,0.1)',
        strokeDashArray: 3,
        xaxis: {
          lines: { show: false }
        }
      },
      plotOptions: {
        bar: { horizontal: false, columnWidth: '35%', borderRadius: [4] }
      },
      chart: {
        type: 'bar',
        height: 390,
        offsetX: -15,
        toolbar: { show: true },
        foreColor: '#adb0bb',
        fontFamily: 'inherit',
        sparkline: { enabled: false }
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      legend: { show: false },
      xaxis: {
        type: 'category',
        categories: categories,
        labels: {
          style: { cssClass: 'grey--text lighten-2--text fill-color' }
        }
      },
      yaxis: {
        show: true,
        min: 0,
        max: maxY,
        tickAmount: 4,
        labels: {
          style: { cssClass: 'grey--text lighten-2--text fill-color' }
        }
      },
      stroke: {
        show: true,
        width: 3,
        lineCap: 'butt',
        colors: ['transparent']
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (value: number, { series, seriesIndex, dataPointIndex, w }: { series: any, seriesIndex: number, dataPointIndex: number, w: any }) => {
            const data: ChartDataPoint = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
            return `${value} (${this.obtenerDescripcionLabor(data.idlabor)})`;
          }
        }
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              bar: { borderRadius: 3 }
            }
          }
        }
      ]
    };

    // Imprime las descripciones de las labores en la consola
    series.forEach(serie => {
      serie.data.forEach(dataPoint => {
        console.log(this.obtenerDescripcionLabor(dataPoint.idlabor));
      });
    });
  }

  // Método para obtener la descripción de la labor
  obtenerDescripcionLabor(idlabor: string): string {
    const descripcion = descripciones.data.find((item: any) =>
      item.labores.some((labor: any) => labor.idlabor === idlabor)
    )?.labores.find((labor: any) => labor.idlabor === idlabor)?.descripcion;

    return descripcion || idlabor;
  }
}