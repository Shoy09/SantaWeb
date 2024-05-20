import { Stats } from './../../data/Stats';
import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
} from 'ng-apexcharts';
import { Detalle, ImporteDetalle } from 'src/app/data/ImporteDetalle';
import descripciones from '../../json/Descripciones.json';

interface DescripcionesEncontradas {
  idactividades: { [key: string]: string };
  idlabores: { [key: string]: string };
}
interface DescripcionesMostradas {
  idactividades: { [key: string]: string };
  idlabores: { [key: string]: string };
}


export interface yearlyChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}

export interface monthlyChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
}



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dashboard.component.scss'] // Corrected the extension from.scs to.scss
})
export class AppDashboardComponent implements OnInit{
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public processedImportaciones: ImporteDetalle[] = []; // Definir la propiedad aquí
  public importaciones: ImporteDetalle[] = [];
  listaDeDetalles: Detalle[] = [];
  idcodigogeneral: string = '';
  totalCantidadConActividadD!: number;
  listaDeDetallesConDescripciones: any[] = [];
  descripcionesMostradas: DescripcionesMostradas = {
    idactividades: {},
    idlabores: {}
  };
  datosParaGraficoBarras: any[] = [];
  


  public yearlyChart!: Partial<yearlyChart> | any;
  public monthlyChart!: Partial<monthlyChart> | any;

  displayedColumns: string[] = ['assigned', 'name', 'priority', 'budget'];


  // recent transaction
  stats: Stats[] = [];

  // ecommerce card

  constructor(private http: HttpClient) {
    // sales overview chart
    
    // yearly breakup chart
    this.yearlyChart = {
      series: [38, 40, 25],

      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 130,
      },
      colors: ['#5D87FF', '#ECF2FF', '#F9F9FD'],
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          donut: {
            size: '75%',
            background: 'transparent',
          },
        },
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 991,
          options: {
            chart: {
              width: 120,
            },
          },
        },
      ],
      tooltip: {
        enabled: false,
      },
    };

    // mohtly earnings chart
    this.monthlyChart = {
      series: [
        {
          name: '',
          color: '#49BEFF',
          data: [25, 66, 20, 40, 12, 58, 20],
        },
      ],

      chart: {
        type: 'area',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 60,
        sparkline: {
          enabled: true,
        },
        group: 'sparklines',
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        colors: ['#E8F7FF'],
        type: 'solid',
        opacity: 0.05,
      },
      markers: {
        size: 0,
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
    };
  }

  ngOnInit(): void {
    // Verificar si sessionStorage está disponible antes de intentar acceder a él
    if (typeof sessionStorage !== 'undefined') {
      // Recuperar los datos almacenados en sessionStorage
      this.idcodigogeneral = sessionStorage.getItem('dni') || '';
        }

    // Verificar si idcodigogeneral tiene un valor válido antes de llamar a fetchImportacionDetails()

    if (this.idcodigogeneral) {
      this.fetchImportacionDetails();
    }
  }

  fetchImportacionDetails() {
    this.http.get<ImporteDetalle[]>('https://dioses121.pythonanywhere.com/api/importaciones/' + this.idcodigogeneral + '/').subscribe(
      (data: ImporteDetalle[]) => {
        if (data && data.length > 0) {
          this.importaciones = data;
          this.processImportacionesForChildComponent(); // Llama a la nueva función de procesamiento
          
          // Las otras funciones que necesitas mantener
          this.listaDeDetalles = [];
          let idactividades: string[] = [];
          let idlabores: string[] = [];

          data.forEach(importeDetalle => {
            if (importeDetalle.detalle && importeDetalle.detalle.length > 0) {
              this.listaDeDetalles.push(...importeDetalle.detalle.filter(detalle => parseFloat(detalle.cantidad) > 0.0));
              importeDetalle.detalle.forEach(detalle => {
                if (detalle.idactividad) {
                  idactividades.push(detalle.idactividad);
                }
                if (detalle.idlabor) {
                  idlabores.push(detalle.idlabor);
                }
              });
            }
          });

          this.processStats(data);
          this.sumarCantidadDetallesConActividadD();
          this.procesarDatosParaGrafico(this.listaDeDetalles);
          this.mapearJSON(idactividades, idlabores);
        } else {
          console.error('La respuesta de la solicitud HTTP no tiene los datos esperados:', data);
        }
      },
      (error) => {
        console.error('Error al obtener detalles de importación:', error);
      }
    );
  }

  processImportacionesForChildComponent(importaciones: ImporteDetalle[] = this.importaciones) {
    // Aquí procesas los datos de `importaciones` para el componente hijo
    this.processedImportaciones = importaciones.map(importeDetalle => {
      // Procesa cada `importeDetalle` según sea necesario para el componente hijo
      return {
        ...importeDetalle,
        // Realiza cualquier transformación o filtrado adicional que necesites
      };
    });
  }  

  procesarDatosParaGrafico(detalles: Detalle[]) {
    const cantidadPorLabor: { [key: string]: number } = {};

    detalles.forEach(detalle => {
      if (cantidadPorLabor[detalle.idlabor]) {
        cantidadPorLabor[detalle.idlabor] += parseInt(detalle.cantidad, 10);
      } else {
        cantidadPorLabor[detalle.idlabor] = parseInt(detalle.cantidad, 10);
      }
    });

    this.datosParaGraficoBarras = Object.keys(cantidadPorLabor).map(idlabor => {
      const descripcion = this.obtenerDescripcionLabor(idlabor);
      return { name: descripcion, value: cantidadPorLabor[idlabor] };
    });
  }
  obtenerDescripcionLabor(idlabor: string): string {
    const descripcion = descripciones.data.find((item: any) =>
      item.labores.some((labor: any) => labor.idlabor === idlabor)
    )?.labores.find((labor: any) => labor.idlabor === idlabor)?.descripcion;

    return descripcion || idlabor;
  }
  obtenerDescripcionActividad(idactividad: string): string {
    const descripcion = descripciones.data.find((item: any) =>
      item.idactividad === idactividad)?.descripcion;
  
    return descripcion || idactividad;
  }
  mapearJSON(idactividades: string[], idlabores: string[]) {
    const descripcionesEncontradas: DescripcionesEncontradas = {
      idactividades: {},
      idlabores: {}
    };

    descripciones.data.forEach((item: any) => {
      if (idactividades.includes(item.idactividad)) {
        descripcionesEncontradas.idactividades[item.idactividad] = item.descripcion;
      }
      item.labores.forEach((labor: any) => {
        if (idlabores.includes(labor.idlabor)) {
          descripcionesEncontradas.idlabores[labor.idlabor] = labor.descripcion;
        }
      });
    });

    this.otraFuncion(idactividades, idlabores, descripcionesEncontradas);
  }

  otraFuncion(idactividades: string[], idlabores: string[], descripcionesEncontradas: DescripcionesEncontradas) {
    const descripcionesMostradas: DescripcionesMostradas = {
      idactividades: {},
      idlabores: {}
    };

    for (const idActividad in descripcionesEncontradas.idactividades) {
      const descripcion = descripcionesEncontradas.idactividades[idActividad];
      descripcionesMostradas.idactividades[idActividad] = descripcion;
    }

    for (const idLabor in descripcionesEncontradas.idlabores) {
      const descripcion = descripcionesEncontradas.idlabores[idLabor];
      descripcionesMostradas.idlabores[idLabor] = descripcion;
    }

    const listaDeDetallesConDescripciones = this.listaDeDetalles.map(detalle => ({
      item: detalle.item,
      idactividad: descripcionesMostradas.idactividades[detalle.idactividad] || detalle.idactividad,
      idlabor: descripcionesMostradas.idlabores[detalle.idlabor] || detalle.idlabor,
      cantidad: detalle.cantidad
    }));

    this.listaDeDetallesConDescripciones = listaDeDetallesConDescripciones;
    
  }

  processStats(data: ImporteDetalle[]) {
    const processedStats: Stats[] = [];
    const recentImportaciones = data.slice(-6); // Procesa solo las últimas 6 importaciones
    
    // Iteramos sobre las últimas 6 importaciones y agregamos detalles limitados a processedStats
    for (let i = recentImportaciones.length - 1; i >= 0 && processedStats.length < 6; i--) {
      const importeDetalle = recentImportaciones[i];
      for (let j = 0; j < importeDetalle.detalle.length && processedStats.length < 6; j++) {
        const detalle = importeDetalle.detalle[j];
        const actividadDescripcion = this.obtenerDescripcionActividad(detalle.idactividad); // Obtenemos la descripción de la actividad
        const laborDescripcion = this.obtenerDescripcionLabor(detalle.idlabor); // Obtenemos la descripción de la labor
        const stat: Stats = {
          color: 'primary',
          fecha: importeDetalle.fecha,
          actividad: actividadDescripcion, // Usamos la descripción en lugar del ID de la actividad
          labor: laborDescripcion // Usamos la descripción en lugar del ID de la labor
        };
        processedStats.push(stat);
      }
    }
    
    this.stats = processedStats;
  }
  
  sumarCantidadDetallesConActividadD(): void {
    // Filtrar los detalles cuyo idactividad empieza con 'D'
    const detallesConActividadD = this.listaDeDetalles.filter(detalle => detalle.idactividad.startsWith('D'));

    // Sumar las cantidades de los detalles filtrados
    this.totalCantidadConActividadD = detallesConActividadD.reduce((total, detalle) => {
      // Convertir la cantidad a número y sumarla al total
      return total + parseFloat(detalle.cantidad);
    }, 0);
  }

  calcularSumaDeCantidades(): number {
    let suma = 0;
    // Iterar sobre cada detalle y sumar la cantidad
    this.listaDeDetalles.forEach(detalle => {
      suma += parseFloat(detalle.cantidad); // Convertir la cantidad a número antes de sumar
    });
    return suma;
  }
  calcularMediaDeRendimiento(): string {
    // Filtrar los detalles cuya idactividad empieza con 'D'
    const detallesConActividadD = this.listaDeDetalles.filter(detalle => detalle.idactividad.startsWith('D'));
  
    // Calcular la suma de cantidades de los detalles filtrados
    const suma = detallesConActividadD.reduce((total, detalle) => total + parseFloat(detalle.cantidad), 0);
  
    // Calcular la cantidad total de detalles filtrados
    const cantidadTotalDetalles = detallesConActividadD.length;
  
    // Calcular la media de rendimiento
    if (cantidadTotalDetalles > 0) {
      const media = suma / cantidadTotalDetalles;
      return media.toFixed(2); // Redondear a dos decimales y convertir a string
    } else {
      return '0.00'; // Evitar dividir por cero y retornar 0.00 si no hay detalles
    }
  }
  

  //Filtros
  
  filtrarPorFecha() {
    const fechaInicioInput = (document.getElementById('fechaInicio') as HTMLInputElement).value;
    const fechaFinInput = (document.getElementById('fechaFin') as HTMLInputElement).value;
  
    const fechaInicio = fechaInicioInput ? this.convertirFechaAYYYYMMDD(fechaInicioInput) : null;
    const fechaFin = fechaFinInput ? this.convertirFechaAYYYYMMDD(fechaFinInput) : null;
  
    console.log('Rango de fechas seleccionado:');
    console.log('Fecha de inicio:', fechaInicio);
    console.log('Fecha de fin:', fechaFin);
  
    const importacionesEnRango = fechaInicio && fechaFin ?
      this.importaciones.filter(importacion => {
        const fechaImportacion = importacion.fecha;
        return fechaImportacion >= fechaInicio && fechaImportacion <= fechaFin;
      }) :
      this.importaciones;
  
    this.listaDeDetalles = [];
  
    importacionesEnRango.forEach(importacion => {
      if (importacion.detalle && importacion.detalle.length > 0) {
        this.listaDeDetalles.push(...importacion.detalle.filter(detalle => parseFloat(detalle.cantidad) > 0.0));
      }
    });
  
    const idactividades: string[] = [];
    const idlabores: string[] = [];
    this.listaDeDetalles.forEach(detalle => {
      if (detalle.idactividad) {
        idactividades.push(detalle.idactividad);
      }
      if (detalle.idlabor) {
        idlabores.push(detalle.idlabor);
      }
    });
  
    this.mapearJSON(idactividades, idlabores);
    this.procesarDatosParaGrafico(this.listaDeDetalles);
    this.sumarCantidadDetallesConActividadD();
    this.processStats(importacionesEnRango); // Llamamos a processStats con los datos filtrados
  
    this.processImportacionesForChildComponent(importacionesEnRango); // Actualizamos processedImportaciones con los datos filtrados
  
    console.log('Importaciones dentro del rango de fechas:', importacionesEnRango);
  }
  

  // Función para convertir una fecha al formato YYYYMMDD
  convertirFechaAYYYYMMDD(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}${mes}${dia}`;
  }

  QuitarFiltro() {
    const fechaInicioInput = document.getElementById('fechaInicio') as HTMLInputElement;
    const fechaFinInput = document.getElementById('fechaFin') as HTMLInputElement;
    fechaInicioInput.value = '';
    fechaFinInput.value = '';
  
    this.listaDeDetalles = [];
  
    this.importaciones.forEach(importacion => {
      if (importacion.detalle && importacion.detalle.length > 0) {
        this.listaDeDetalles.push(...importacion.detalle.filter(detalle => parseFloat(detalle.cantidad) > 0.0));
      }
    });
  
    const idactividades: string[] = [];
    const idlabores: string[] = [];
    this.listaDeDetalles.forEach(detalle => {
      if (detalle.idactividad) {
        idactividades.push(detalle.idactividad);
      }
      if (detalle.idlabor) {
        idlabores.push(detalle.idlabor);
      }
    });
  
    this.mapearJSON(idactividades, idlabores);
    this.procesarDatosParaGrafico(this.listaDeDetalles);
    this.sumarCantidadDetallesConActividadD();
    this.processStats(this.importaciones); // Llamamos a processStats con todos los datos
  
    this.processImportacionesForChildComponent(); // Llama a la función para actualizar los datos del componente hijo
  }
  

}
