import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDocumentsTableComponent } from './patient-documents-table.component';

describe('PatientDocumentsTableComponent', () => {
  let component: PatientDocumentsTableComponent;
  let fixture: ComponentFixture<PatientDocumentsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientDocumentsTableComponent]
    });
    fixture = TestBed.createComponent(PatientDocumentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
