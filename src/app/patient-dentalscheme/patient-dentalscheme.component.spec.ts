import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDentalschemeComponent } from './patient-dentalscheme.component';

describe('PatientDentalschemeComponent', () => {
  let component: PatientDentalschemeComponent;
  let fixture: ComponentFixture<PatientDentalschemeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientDentalschemeComponent]
    });
    fixture = TestBed.createComponent(PatientDentalschemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
