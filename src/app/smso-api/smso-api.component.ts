import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-smso-api',
  templateUrl: './smso-api.component.html',
  styleUrls: ['./smso-api.component.scss']
})
export class SmsoApiComponent {
  smsoApiForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.smsoApiForm = this.formBuilder.group({
      apiKey: ['', Validators.required],
      senderId: ['', [Validators.required]]
    });
  }

  saveForm(): void {
    if (this.smsoApiForm.valid) {
      console.log('Form data:', this.smsoApiForm.value);
      // Aici poți adăuga logica pentru salvarea datelor
    } else {
      // Poți trata cazul în care formularul nu este valid
    }
  }
}
