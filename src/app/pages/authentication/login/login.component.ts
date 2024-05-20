import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent {
  dni: string = '';
  password: string = '';
  notificationMessage: string = '';
  constructor(private router: Router, private http: HttpClient, private elementRef: ElementRef, private renderer:Renderer2, private toastr: ToastrService) {}

  onLogin() {
    this.http.post<any>('https://santa02.pythonanywhere.com/api/token/', { dni: this.dni, password: this.password }).pipe(
      catchError(error => {
        console.error('Error al iniciar sesión:', error);
        return throwError(error);
      })
    ).subscribe(
      response => {
        console.log('Respuesta del servidor:', response); // Verificar la respuesta completa del servidor

        // Guardar el token en sessionStorage
        const token = response.access; // Aquí cambia de access_token a access
        sessionStorage.setItem('token', token);

        this.getCurrentUserData();

        // Llamar a la función para obtener los datos del usuario actual

        // Mostrar notificación de éxito
        this.toastr.success('Inicio de sesión exitoso', 'Bienvenido');

    },
      error => {
        if (error.status === 401) {
          // Error de autorización, el usuario no está autorizado
          this.toastr.error('Credenciales inválidas. Por favor, inténtalo de nuevo.', 'Error de inicio de sesión');
        } else {
          console.error('Error al iniciar sesión:', error);
          this.toastr.error(`Error al iniciar sesión: ${error.message}`, 'Error de inicio de sesión');
        }
      }
    );
  }
  getCurrentUserData() {
    // Obtener el token almacenado en sessionStorage
    const token = sessionStorage.getItem('token');

    if (token) {
      // Crear las cabeceras de la solicitud con el token de autorización
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      console.log('Cabecera de solicitud:', headers); // Imprime la cabecera de la solicitud

      // Realizar la solicitud HTTP para obtener los datos del usuario actual
      this.http.get<any>('https://santa02.pythonanywhere.com/api/current-user/', { headers }).subscribe(
        userData => {
          console.log('JSON de los datos del usuario actual:', JSON.stringify(userData, null, 2)); // Imprime el JSON de los datos del usuario actual

          // Almacena todos los datos del usuario en sessionStorage
          sessionStorage.setItem('dni', userData.dni);
          sessionStorage.setItem('apel_nomb', userData.apel_nomb);
          sessionStorage.setItem('tipo_usuarioapp', userData.tipo_usuarioapp);
          sessionStorage.setItem('imagen_usuario', userData.imagen_usuario);
          sessionStorage.setItem('descripcion', userData.descripcion);
          sessionStorage.setItem('fecha_nacimiento', userData.fecha_nacimiento);
          sessionStorage.setItem('telefono', userData.telefono);
          sessionStorage.setItem('gmail', userData.gmail);

          this.router.navigate(['/dashboard']);

        },
        error => {
          console.error('Error al obtener los datos del usuario actual:', error);
          // Manejar el error de obtener datos del usuario actual
        }
      );
    } else {
      console.error('No hay token disponible para la solicitud.');
      // Manejar el caso en el que no haya un token disponible
    }
  }

}
