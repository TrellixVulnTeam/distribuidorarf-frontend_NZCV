import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresPopupComponent } from './proveedores-popup.component';

describe('ProveedoresPopupComponent', () => {
  let component: ProveedoresPopupComponent;
  let fixture: ComponentFixture<ProveedoresPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProveedoresPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedoresPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
