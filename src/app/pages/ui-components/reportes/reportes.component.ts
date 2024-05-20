import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class AppReportesComponent {

  descripcionReporte: string = '';
  dni: string = '';
  idcodigogeneral: string = '';
  apel_nomb: string = '';
  tipo_usuarioapp: string = '';
  imagen_usuario: string = '';

  descripcion: string = '';
  fecha_nacimiento: string = '';
  telefono: string = '';
  gmail: string = '';

  constructor() {}

  ngOnInit(): void {
    // Verificar si sessionStorage está disponible antes de intentar acceder a él
    if (typeof sessionStorage !== 'undefined') {
      // Recuperar los datos almacenados en sessionStorage
      this.dni = sessionStorage.getItem('dni') || '';
      this.idcodigogeneral = sessionStorage.getItem('dni') || '';
      this.apel_nomb = sessionStorage.getItem('apel_nomb') || '';
      this.tipo_usuarioapp = sessionStorage.getItem('tipo_usuarioapp') || '';
      this.imagen_usuario = sessionStorage.getItem('imagen_usuario') || '';
      console.log('Valor de imagen_usuario:', this.imagen_usuario);
      this.descripcion = sessionStorage.getItem('descripcion') || '';
      this.fecha_nacimiento = sessionStorage.getItem('fecha_nacimiento') || '';
      this.telefono = sessionStorage.getItem('telefono') || '';
      this.gmail = sessionStorage.getItem('gmail') || '';
        }
  }
  enviarReporte() {
    const mensaje = `send?phone=51973415832&text=*Reporte de Problema*%0A*DNI:* ${this.dni}%0A*Teléfono:* ${this.telefono}%0A*Descripción del Problema:* ${this.descripcionReporte}%0A*Nombre:* ${this.apel_nomb}%0A*Email:* ${this.gmail}`;
    const url = 'https://web.whatsapp.com/' + mensaje; // Cambia a la URL de WhatsApp si estás en un dispositivo móvil
    window.open(url, '_blank');
  }
}

