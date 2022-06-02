import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionDetalleProductosComponent } from './asignacion-detalle-productos.component';

describe('AsignacionDetalleProductosComponent', () => {
  let component: AsignacionDetalleProductosComponent;
  let fixture: ComponentFixture<AsignacionDetalleProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignacionDetalleProductosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionDetalleProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
