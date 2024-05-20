import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-usuario',
    standalone: true,
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.scss'],
    imports: [CommonModule, FormsModule]
})
export class AppUsuarioComponent implements OnInit {
  dni: string = '';
  idcodigogeneral: string = '';
  apel_nomb: string = '';
  tipo_usuarioapp: string = '';
  imagen_usuario: string = '';
  descripcion: string = '';
  fecha_nacimiento: string = '';
  telefono: string = '';
  gmail: string = '';

  defaultImage: string = 'assets/images/profile/user-1.jpg'; // Ruta de la imagen por defecto
  mostrarSegundo: boolean = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  mostrarSegundoElemento() {
    this.mostrarSegundo = true;
  }
  ocultarSegundoElemento() {
    this.mostrarSegundo = false;
  }
  ngOnInit(): void {
    if (typeof sessionStorage !== 'undefined') {
      this.dni = sessionStorage.getItem('dni') || '';
      this.idcodigogeneral = sessionStorage.getItem('dni') || '';
      this.apel_nomb = sessionStorage.getItem('apel_nomb') || '';
      this.tipo_usuarioapp = sessionStorage.getItem('tipo_usuarioapp') || '';
      this.imagen_usuario = sessionStorage.getItem('imagen_usuario') || '';
      this.descripcion = sessionStorage.getItem('descripcion') || '';
      this.fecha_nacimiento = sessionStorage.getItem('fecha_nacimiento') || '';
      this.telefono = sessionStorage.getItem('telefono') || '';
      this.gmail = sessionStorage.getItem('gmail') || '';
    }
  }

  getUserImage(): string {
    // Verifica si imagen_usuario es nula, indefinida o una cadena vacía
    if (!this.imagen_usuario || this.imagen_usuario === 'null') {
      return this.defaultImage;
    }
    return this.imagen_usuario;
  }

  actualizarUsuario() {
    const datosActualizados = {
      descripcion: this.descripcion,
      telefono: this.telefono,
      gmail: this.gmail,
      fecha_nacimiento: this.fecha_nacimiento
    };

    // Obtener el token de sessionStorage
    const token = sessionStorage.getItem('token');
    console.log('token para actualizacion', token)

    // Configurar los encabezados
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.put(`https://santa02.pythonanywhere.com/api/usuarios/actualizar/${this.dni}/`, datosActualizados, { headers }).subscribe(
      (response) => {
        console.log('Usuario actualizado exitosamente:', response);
        this.toastr.success('Usuario actualizado exitosamente', 'Éxito');
        
        // Actualizar sessionStorage con los nuevos datos
        sessionStorage.setItem('descripcion', this.descripcion);
        sessionStorage.setItem('telefono', this.telefono);
        sessionStorage.setItem('gmail', this.gmail);
        sessionStorage.setItem('fecha_nacimiento', this.fecha_nacimiento);

        // Puedes actualizar otros campos si también son modificables
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
        this.toastr.error('Hubo un error al actualizar el usuario', 'Error');
      }
    );
  }
}