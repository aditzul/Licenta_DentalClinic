import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service';
import { MedicService } from '../_services/medic.service';
import { PatientService } from '../_services/patient.service';
import { Medic } from '../_models/medic';
import { Patient } from '../_models/patient';
import { Role, User } from '../_models/user';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  medics: Medic[] = [];
  currentMedic: Medic = {};
  currentUser: User = {};
  loaded = false;
  hideMain = false;

  constructor(
    private patientService: PatientService,
    private medicService: MedicService,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.userValue || {};
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        switchMap((route: ActivatedRoute) => this.resolveHideMain())
      )
      .subscribe((isHidden: boolean) => {
        this.hideMain = isHidden;
        if (!isHidden) {
          this.getData();
        }
      });

    this.hideMain = this.shouldHideMain();

    if (this.hideMain) {
      return;
    }

    this.getData();
  }

  resolveHideMain(): Observable<boolean> {
    return of(this.shouldHideMain());
  }

  shouldHideMain() {
    const routerSubPaths = this.router.url.split('/').length;
    return routerSubPaths === 3;
  }

  getData() {
    if (!this.currentUser) {
      return; // If currentUser is undefined, exit the function
    }
  
    if (this.currentUser.role === Role.Admin) {
      // User is an Admin, load all patients
      this.patientService.getAllPatients().subscribe((patients) => {
        this.loaded = true;
        this.patients = patients;
      });
    } else if (this.currentUser.role === Role.Medic) {
      // User is a Medic, load patients by Medic ID
      const medicId = this.currentUser.id;
  
      if (medicId) {
        this.patientService.getPatientsByMedicID(medicId.toString()).subscribe((assignedPatientsData) => {
          this.loaded = true;
          this.patients = assignedPatientsData?.assignedPatients || [];
        });
      } else {
        console.error('Medic ID not found in user details.');
      }
    }
  }  
  
}
