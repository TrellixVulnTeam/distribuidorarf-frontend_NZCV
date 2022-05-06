import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioKardexComponent } from './formulario-kardex.component';

describe('FormularioKardexComponent', () => {
  let component: FormularioKardexComponent;
  let fixture: ComponentFixture<FormularioKardexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioKardexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioKardexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
