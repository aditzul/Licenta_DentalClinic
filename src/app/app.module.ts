import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuListItemComponent } from './menu-list-item/menu-list-item.component';
import { UsersComponent } from './users/users.component';
import { PatientsComponent } from './patients/patients.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ProfileComponent } from './profile/profile.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { SnackbarInterceptor } from './_helpers/SnackBarInterceptor';
import { SimpleCardComponent } from './simple-card/simple-card.component';
import { DatePipe } from '@angular/common';
import { PatientTableComponent } from './patient-table/patient-table.component';
import { PatientViewComponent } from './patient-view/patient-view.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    DashboardComponent,
    MenuListItemComponent,
    UsersComponent,
    PatientsComponent,
    BreadcrumbsComponent,
    ProfileComponent,
    UserDetailsComponent,
    UserDialogComponent,
    SimpleCardComponent,
    PatientTableComponent,
    PatientViewComponent,
    PatientDetailsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule, MaterialModule],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SnackbarInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
