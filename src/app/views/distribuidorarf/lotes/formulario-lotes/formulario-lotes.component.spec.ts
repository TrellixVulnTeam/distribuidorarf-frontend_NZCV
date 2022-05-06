import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioLotesComponent } from './formulario-lotes.component';

describe('FormularioLotesComponent', () => {
  let component: FormularioLotesComponent;
  let fixture: ComponentFixture<FormularioLotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioLotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioLotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
