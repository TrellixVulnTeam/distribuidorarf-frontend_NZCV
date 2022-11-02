import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoProformasComponent } from './listado-proformas.component';

describe('ListadoProformasComponent', () => {
  let component: ListadoProformasComponent;
  let fixture: ComponentFixture<ListadoProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoProformasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
