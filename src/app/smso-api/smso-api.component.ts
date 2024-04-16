import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../_services/settings.service';
import { SMSOSettings } from '../_models/settings';

@Component({
  selector: 'app-smso-api',
  templateUrl: './smso-api.component.html',
  styleUrls: ['./smso-api.component.scss']
})
export class SmsoApiComponent implements OnInit {
  smsoApiForm: FormGroup;
  smsoSettingsData: any; // Definește o variabilă pentru a stoca datele de la serviciul SMS Settings

  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService
  ) {
    this.smsoApiForm = this.formBuilder.group({
      SMSO_API_KEY: ['', Validators.required],
      SMSO_SENDER_ID: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.settingsService.getSMSOSettings().subscribe(response => {
      if (response && response.length > 0) {
        const smsoSettings = response[0];

        this.smsoApiForm.patchValue({
          SMSO_API_KEY: smsoSettings.SMSO_API_KEY,
          SMSO_SENDER_ID: smsoSettings.SMSO_SENDER_ID
        });
      }
    });
  }

  saveForm(): void {
    if (this.smsoApiForm.valid) {
      const updatedSettings: SMSOSettings = {
        SMSO_API_KEY: this.smsoApiForm.value.SMSO_API_KEY,
        SMSO_SENDER_ID: this.smsoApiForm.value.SMSO_SENDER_ID,
      };
      this.settingsService.updateSMSOSettings(updatedSettings).subscribe(response => {
      });
    }
  }
 
}
