import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class AppSideRegisterComponent {
  dni: string = '';
  telefono: string = '';
  gmail: string = '';
  apel_nomb: string = '';



  constructor(private router: Router) {}
  submit() {
    // console.log(this.form.value);
    this.router.navigate(['/dashboard']);
  }
  enviarParaCredenciales() {
    const mensaje = `send?phone=51973415832&text=*Necesito credenciales*%0A*DNI:* ${this.dni}%0A*Teléfono:* ${this.telefono}%0A*Nombre:* ${this.apel_nomb}%0A*Email:* ${this.gmail}`;
    const url = 'https://web.whatsapp.com/' + mensaje; // Cambia a la URL de WhatsApp si estás en un dispositivo móvil
    window.open(url, '_blank');
  }
}
