import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsConditionsComponent } from './settings-conditions.component';

describe('SettingsConditionsComponent', () => {
  let component: SettingsConditionsComponent;
  let fixture: ComponentFixture<SettingsConditionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsConditionsComponent]
    });
    fixture = TestBed.createComponent(SettingsConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
