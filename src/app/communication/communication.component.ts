import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../_services/settings.service';
import { SMSSettings } from '../_models/settings';

interface SMS_SEND_DAYS {
  value: string;
}

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss']
})

export class CommunicationComponent implements OnInit {
  smsSettingsForm: FormGroup;
  selectedValue: string | undefined;
  isEnabled: boolean | undefined;
  checked = false;
  hours: string[] = [
    '08:00',
    '09:00',
    '10:00',
    // și alte ore...
  ];

  days: SMS_SEND_DAYS[] = [
    {value:'1'},
    {value:'2'},
    {value:'3'},
    {value:'4'},
  ]

  onToggleChange(event: any) {
    this.isEnabled = event.checked; // Actualizează valoarea isEnabled cu starea curentă a toggle-ului
  }  

  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService
  ) {
    this.smsSettingsForm = this.formBuilder.group({
      SMS_SEND_DAYS: ['', Validators.required],
      SMS_SEND_HOUR: ['', Validators.required],
      SMS_SEND_SMS: ['', Validators.required],
      SMS_TEMPLATE: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.settingsService.getSMSSettings().subscribe(response => {
      if (response && response.length > 0) {
        const smsSettings = response[0];
        const date = new Date(smsSettings.SMS_SEND_HOUR);
        date.setHours(date.getHours() - 2); // Scade 2 ore din ora curentă
        const formattedHour = ("0" + date.getHours()).slice(-2); // Adaugă un zero în față dacă ora este formată dintr-un singur caracter și apoi selectează ultimele două caractere
        const formattedMinute = ("0" + date.getMinutes()).slice(-2); // Adaugă un zero în față dacă minutul este format dintr-un singur caracter și apoi selectează ultimele două caractere
        const formattedTime = formattedHour + ':' + formattedMinute;

        this.smsSettingsForm.patchValue({
          SMS_SEND_DAYS: smsSettings.SMS_SEND_DAYS.toString(),
          SMS_SEND_HOUR: formattedTime,
          SMS_SEND_SMS: smsSettings.SMS_SEND_SMS,
          SMS_TEMPLATE: smsSettings.SMS_TEMPLATE
        });
        this.isEnabled = smsSettings.SMS_SEND_SMS === 1;
      }
    });
    
  }
  

  saveForm(): void {
    if (this.smsSettingsForm.valid) {
      const updatedSettings: SMSSettings = {
        SMS_SEND_DAYS: this.smsSettingsForm.value.SMS_SEND_DAYS,
        SMS_SEND_HOUR: this.smsSettingsForm.value.SMS_SEND_HOUR,
        SMS_SEND_SMS: this.isEnabled ? 1 : 0, // Converteste valoarea booleana in 1 sau 0
        SMS_TEMPLATE: this.smsSettingsForm.value.SMS_TEMPLATE,
      };
      this.settingsService.updateSMSSettings(updatedSettings).subscribe(response => {
      });
    }
  }
 
}
