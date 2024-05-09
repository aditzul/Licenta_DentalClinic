import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/user';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavComponent } from './nav/nav.component';
import { PatientsComponent } from './patients/patients.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { SettingsComponent } from './settings/settings.component';
import { SmsoApiComponent } from './smso-api/smso-api.component';

const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        data: { breadcrumb: 'Home' },
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.Medic], breadcrumb: 'Dashboard' },
      },
      {
        path: 'patients',
        component: PatientsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.Medic], breadcrumb: 'Patients' },
        children: [
          {
            path: ':userId',
            canActivate: [AuthGuard],
            data: { roles: [Role.Admin, Role.Medic], breadcrumb: 'Details' },
            component: PatientDetailsComponent,
          },
        ],
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.Medic], breadcrumb: 'Appointments' },
      },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin], breadcrumb: 'Admin' },
        children: [
          {
            path: '',
            redirectTo: '/admin/users',
            pathMatch: 'full',
            data: { breadcrumb: 'Admin' },
          },
          {
            path: 'users',
            component: UsersComponent,
            canActivate: [AuthGuard],
            data: { roles: [Role.Admin], breadcrumb: 'Users' },
          },
          {
            path: 'smso-api',
            component: SmsoApiComponent,
            canActivate: [AuthGuard],
            data: { roles: [Role.Admin], breadcrumb: 'SMSO API' },
          }
        ],
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.Medic], breadcrumb: 'Settings' },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin, Role.Medic], breadcrumb: 'Profile' },
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
