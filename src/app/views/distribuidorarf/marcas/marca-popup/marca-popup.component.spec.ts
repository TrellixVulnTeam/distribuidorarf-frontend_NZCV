import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcaPopupComponent } from './marca-popup.component';

describe('MarcaPopupComponent', () => {
  let component: MarcaPopupComponent;
  let fixture: ComponentFixture<MarcaPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarcaPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
