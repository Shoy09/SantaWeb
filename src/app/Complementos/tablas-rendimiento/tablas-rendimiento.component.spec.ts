import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablasRendimientoComponent } from './tablas-rendimiento.component';

describe('TablasRendimientoComponent', () => {
  let component: TablasRendimientoComponent;
  let fixture: ComponentFixture<TablasRendimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablasRendimientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablasRendimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
