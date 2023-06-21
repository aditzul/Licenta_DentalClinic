import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/user';
import { MedicComponent } from './medic/medic.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavComponent } from './nav/nav.component';
import { PatientsComponent } from './patients/patients.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminUserDetailsComponent } from './admin-user-details/admin-user-details.component';

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
            children: [
              {
                path: ':id',
                canActivate: [AuthGuard],
                data: { roles: [Role.Admin], breadcrumb: ':id' },
                component: AdminUserDetailsComponent,
              },
            ]
          },
          {
            path: 'medics',
            component: MedicComponent,
            canActivate: [AuthGuard],
            data: { roles: [Role.Admin], breadcrumb: 'Medics' },
          },
        ],
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
