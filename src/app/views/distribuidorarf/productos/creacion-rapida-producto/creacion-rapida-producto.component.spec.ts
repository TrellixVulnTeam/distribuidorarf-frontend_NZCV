import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionRapidaProductoComponent } from './creacion-rapida-producto.component';

describe('CreacionRapidaProductoComponent', () => {
  let component: CreacionRapidaProductoComponent;
  let fixture: ComponentFixture<CreacionRapidaProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionRapidaProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreacionRapidaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
