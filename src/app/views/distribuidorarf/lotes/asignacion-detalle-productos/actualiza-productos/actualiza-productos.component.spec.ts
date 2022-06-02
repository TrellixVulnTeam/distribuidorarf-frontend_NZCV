import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizaProductosComponent } from './actualiza-productos.component';

describe('ActualizaProductosComponent', () => {
  let component: ActualizaProductosComponent;
  let fixture: ComponentFixture<ActualizaProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizaProductosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
