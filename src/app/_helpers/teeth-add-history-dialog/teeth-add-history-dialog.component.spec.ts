import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeethAddHistoryDialogComponent } from './teeth-add-history-dialog.component';

describe('TeethAddHistoryDialogComponent', () => {
  let component: TeethAddHistoryDialogComponent;
  let fixture: ComponentFixture<TeethAddHistoryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeethAddHistoryDialogComponent]
    });
    fixture = TestBed.createComponent(TeethAddHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
