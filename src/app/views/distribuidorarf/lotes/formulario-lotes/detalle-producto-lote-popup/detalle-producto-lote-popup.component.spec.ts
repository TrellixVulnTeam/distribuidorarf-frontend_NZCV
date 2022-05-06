import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProductoLotePopupComponent } from './detalle-producto-lote-popup.component';

describe('DetalleProductoLotePopupComponent', () => {
  let component: DetalleProductoLotePopupComponent;
  let fixture: ComponentFixture<DetalleProductoLotePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleProductoLotePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleProductoLotePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
