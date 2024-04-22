import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { LocationService } from './../_services/location.service';
import { Patient, PatientDialog } from '../_models/patient';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

interface Country {
  shortName: string;
  name: string;
}

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.scss']
})
export class PatientDialogComponent implements OnInit {
  isAdd: boolean;
  patientForm!: FormGroup;
  allMedics: User[] = [];
  patient: Patient | undefined;
  submitted: boolean = false;

  matcher = new MyErrorStateMatcher();

  countries: Country[] | undefined;
  states: string[] | undefined;
  cities: string[] | undefined;

  country = new FormControl(this.data.patient?.country, [Validators.required]);
  state = new FormControl(this.data.patient?.state, [Validators.required,]);
  city = new FormControl({ value: this.data.patient?.city, disabled: false }, [Validators.required,]);

  constructor(
    private service: LocationService,
    public dialogRef: MatDialogRef<PatientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PatientDialog,
    private userService: UserService,
  ) {
    this.isAdd = !this.data.patient?.id
    this.countries = this.service.getCountries();
    this.initializeForm();
  }

  ngOnInit() {

    this.userService.getAllMedics().subscribe(
      (medics: User[]) => {
        this.allMedics = Object.values(medics);
      },
      (error) => {
        console.error('Error fetching medics:', error);
      }
    );

    this.country.valueChanges.subscribe((country) => {
      this.state.reset();
      this.state.disable();
      if (country) {
        this.states = this.service.getStatesByCountry(country);
        this.state.enable();
      }
    });

    this.state.valueChanges.subscribe((state) => {
      this.city.reset();
      this.city.disable();
      if (state) {
        this.cities = this.service.getCitiesByState(this.country.value ?? '', state);
        this.city.enable();
      }
    });

  }  

  initializeForm() {
    const countryValue = this.data.patient?.country ? this.service.getCountryByShort(this.data.patient.country) : null;
    const stateValue = this.data.patient?.state
    this.patientForm = new FormGroup({
      first_name: new FormControl(this.data.patient?.first_name || '', Validators.required),
      last_name: new FormControl(this.data.patient?.last_name || '', Validators.required),
      cnp: new FormControl(this.data.patient?.cnp || '', [Validators.required, Validators.pattern(/^\d{13}$/)]),
      birth_date: new FormControl(this.data.patient?.birth_date || '', Validators.required),
      sex: new FormControl(this.data.patient?.sex || '', Validators.required),
      address: new FormControl(this.data.patient?.address || '', Validators.required),
      phone: new FormControl(this.data.patient?.phone || '', [Validators.required, Validators.pattern(/^\d{10}$/)]),
      email: new FormControl(this.data.patient?.email || '', [Validators.required, Validators.email]),
      phisical_file: new FormControl(this.data.patient?.phisical_file || ''),
      secondary_contact_name: new FormControl(this.data.patient?.secondary_contact_name || ''),
      secondary_contact_phone: new FormControl(this.data.patient?.secondary_contact_phone || ''),
      medic_id: new FormControl(this.data.patient?.medic_id || (this.allMedics.length > 0 ? this.allMedics[0].id : '')),
      country: new FormControl(this.data.patient?.country),
      state: new FormControl(this.data.patient?.state),
      city: this.city,
    });
    console.log(countryValue['name'])
  }
  

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.submitted = true;
    const details: any = {};
    if (this.data.patient) {
      // If it's an existing patient, set its ID
      details.id = this.data.patient.id;
    }

    // Assign values from form controls to details object
    details.first_name = this.patientForm.get('first_name')?.value;
    details.last_name = this.patientForm.get('last_name')?.value;
    details.cnp = this.patientForm.get('cnp')?.value;
    details.birth_date = this.patientForm.get('birth_date')?.value;
    details.sex = this.patientForm.get('sex')?.value;
    details.address = this.patientForm.get('address')?.value;
    details.phone = this.patientForm.get('phone')?.value;
    details.email = this.patientForm.get('email')?.value;
    details.phisical_file = this.patientForm.get('phisical_file')?.value;
    details.secondary_contact_name = this.patientForm.get('secondary_contact_name')?.value;
    details.secondary_contact_phone = this.patientForm.get('secondary_contact_phone')?.value;
    details.medic_id = this.patientForm.get('medic_id')?.value;
    details.country = this.patientForm.get('country')?.value;
    details.state = this.patientForm.get('state')?.value;
    details.city = this.patientForm.get('city')?.value;

    this.dialogRef.close({
      details,
      patient: this.patient, // Include the patient data for identification
    });
    console.log(details)
  }
}
