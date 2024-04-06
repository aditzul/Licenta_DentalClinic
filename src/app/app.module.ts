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
import { ConfirmDialogComponent } from './_helpers/confirm-dialog/confirm-dialog.component';
import { PatientDialogComponent } from './patient-dialog/patient-dialog.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { AppointmentDialogComponent } from './appointment-dialog/appointment-dialog.component';
import { CalendarDateFormatter, CalendarEventTitleFormatter, CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CustomDateFormatter } from './_shared/custom-date-formatter.provider';
import { CustomEventTitleFormatter } from './_shared/custom-event-title-formatter.provider';
import { NoRightClickDirective } from './_directives/no-right-click.directive';
import { MatTabsModule } from '@angular/material/tabs';
import { CdkMenuModule } from '@angular/cdk/menu';

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
    ConfirmDialogComponent,
    PatientDialogComponent,
    AppointmentsComponent,
    AppointmentDialogComponent,
    NoRightClickDirective,
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    BrowserAnimationsModule, 
    HttpClientModule, 
    MaterialModule,
    MatTabsModule,
    CdkMenuModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SnackbarInterceptor,
      multi: true,
    },
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
