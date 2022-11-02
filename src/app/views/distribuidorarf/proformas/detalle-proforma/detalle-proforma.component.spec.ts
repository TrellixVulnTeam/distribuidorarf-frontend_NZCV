import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProformaComponent } from './detalle-proforma.component';

describe('DetalleProformaComponent', () => {
  let component: DetalleProformaComponent;
  let fixture: ComponentFixture<DetalleProformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleProformaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
