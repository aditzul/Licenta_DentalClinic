import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../_services/patient.service';
import { MedicService } from '../_services/medic.service';
import { AuthenticationService } from '../_services/authentication.service';
import { DatePipe } from '@angular/common';
import { Patient } from '../_models/patient';
import { Medic } from '../_models/medic';
import { Role, User } from '../_models/user';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, filter, map, of, switchMap } from 'rxjs';

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
    this.patientService.getAllPatients().subscribe((patients: Patient[]) => {
      this.medicService.getAllMedics().subscribe((medics: Medic[]) => {
        this.loaded = true;
        this.currentMedic = medics.find((m) => m.useR_ID === this.currentUser.id) || {};

        if (this.currentUser?.role == Role.Admin) {
          this.patients = patients;
          this.medics = medics;
        } else {
          this.patients = patients.filter((p) => p.assignatioN_CODE === this.currentMedic.assignatioN_CODE);
          this.medics.push(this.currentMedic);
        }
      });
    });
  }
}
