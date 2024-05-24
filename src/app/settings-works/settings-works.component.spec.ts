import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsWorksComponent } from './settings-works.component';

describe('SettingsWorksComponent', () => {
  let component: SettingsWorksComponent;
  let fixture: ComponentFixture<SettingsWorksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsWorksComponent]
    });
    fixture = TestBed.createComponent(SettingsWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
