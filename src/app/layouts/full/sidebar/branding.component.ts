import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <div class="branding">
      <a>
        <img
          src="./assets/images/logos/Santa.png"
          class="align-middle m-2"
          alt="logo"
        />
      </a>
    </div>
  `,
  styleUrls: ['./branding.component.scss'] // Asociar el archivo SCSS aquí
})
export class BrandingComponent {
  constructor() {}
}
