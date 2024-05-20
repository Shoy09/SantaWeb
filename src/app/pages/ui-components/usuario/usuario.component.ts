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
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.actualizarImagenUsuario();
    }
  }
  actualizarImagenUsuario() {
    if (!this.selectedFile) {
      this.toastr.error('No se ha seleccionado ninguna imagen', 'Error');
      return;
    }
  
    const formData = new FormData();
    formData.append('imagen_usuario', this.selectedFile);
  
    // Obtener el token de sessionStorage
    const token = sessionStorage.getItem('token');
    console.log('token para actualizacion', token);
  
    // Configurar los encabezados
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    this.http.put(`https://santa02.pythonanywhere.com/api/usuarios/actualizar/${this.dni}/`, formData, { headers }).subscribe(
      (response: any) => {
        console.log('Imagen de usuario actualizada exitosamente:', response);
        this.toastr.success('Se actualizó correctamente la foto de perfil', 'Recarga la pagina');
  
        // Actualizar sessionStorage con la nueva URL de la imagen
        let nuevaURLImagen = response.imagen_usuario;
  
        // Verificar si la URL recibida ya es completa
        if (!nuevaURLImagen.startsWith('http')) {
          // Agregar el dominio de la API a la URL
          nuevaURLImagen = 'https://santa02.pythonanywhere.com' + nuevaURLImagen;
        }
        
        sessionStorage.setItem('imagen_usuario', nuevaURLImagen);
      },
      (error) => {
        console.error('Error al actualizar la imagen del usuario:', error);
        this.toastr.error('Hubo un error al actualizar la foto de perfil', 'Error');
      }
    );
  }
  
  
  
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