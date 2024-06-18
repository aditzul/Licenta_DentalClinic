import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeethHistoryDialogComponent } from './teeth-history-dialog.component';

describe('TeethHistoryDialogComponent', () => {
  let component: TeethHistoryDialogComponent;
  let fixture: ComponentFixture<TeethHistoryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeethHistoryDialogComponent]
    });
    fixture = TestBed.createComponent(TeethHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
