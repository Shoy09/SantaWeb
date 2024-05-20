import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  apel_nomb: string = '';
  imagen_usuario: string = '';
  defaultImage: string = 'assets/images/profile/user-1.jpg'; // Ruta de la imagen por defecto



  constructor(public dialog: MatDialog, private router: Router) {}
  ngOnInit(): void {
    // Verificar si sessionStorage está disponible antes de intentar acceder a él
    if (typeof sessionStorage !== 'undefined') {
      // Recuperar los datos almacenados en sessionStorage
     this.apel_nomb = sessionStorage.getItem('apel_nomb') || '';
     this.imagen_usuario = sessionStorage.getItem('imagen_usuario') || '';

        }
    }
    getUserImage(): string {
      // Verifica si imagen_usuario es nula, indefinida o una cadena vacía
      if (!this.imagen_usuario || this.imagen_usuario === 'null') {
        return this.defaultImage;
      }
      return this.imagen_usuario;
    }
    navigateToUser() {
      console.log('Navegando a /ui-components/usuario');
      this.router.navigate(['/ui-components/usuario']);
    }
  }