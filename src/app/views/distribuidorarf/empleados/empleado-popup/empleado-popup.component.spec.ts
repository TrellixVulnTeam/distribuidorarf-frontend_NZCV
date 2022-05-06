import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoPopupComponent } from './empleado-popup.component';

describe('EmpleadoPopupComponent', () => {
  let component: EmpleadoPopupComponent;
  let fixture: ComponentFixture<EmpleadoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleadoPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
