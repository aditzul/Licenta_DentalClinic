import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsoApiComponent } from './smso-api.component';

describe('SmsoApiComponent', () => {
  let component: SmsoApiComponent;
  let fixture: ComponentFixture<SmsoApiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SmsoApiComponent]
    });
    fixture = TestBed.createComponent(SmsoApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
