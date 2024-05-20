import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tablas-rendimiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tablas-rendimiento.component.html',
  styleUrl: './tablas-rendimiento.component.scss'
})
export class TablasRendimientoComponent {
  @Input() listaDeDetallesConDescripciones: any[] = [];
  ngOnInit() {
    console.log('Datos para tabla:', this.listaDeDetallesConDescripciones);
  }
}
