import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionesProformaComponent } from './versiones-proforma.component';

describe('VersionesProformaComponent', () => {
  let component: VersionesProformaComponent;
  let fixture: ComponentFixture<VersionesProformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionesProformaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionesProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
