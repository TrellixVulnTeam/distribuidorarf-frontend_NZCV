import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaPopupComponent } from './categoria-popup.component';

describe('CategoriaPopupComponent', () => {
  let component: CategoriaPopupComponent;
  let fixture: ComponentFixture<CategoriaPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriaPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
