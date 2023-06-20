import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { MedicComponent } from './medic/medic.component';
import { MaterialModule } from './material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuListItemComponent } from './menu-list-item/menu-list-item.component';
import { UsersComponent } from './users/users.component';
import { PatientsComponent } from './patients/patients.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ProfileComponent } from './profile/profile.component';
import { UserDetailsComponent } from './user-details/user-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    MedicComponent,
    DashboardComponent,
    MenuListItemComponent,
    UsersComponent,
    PatientsComponent,
    BreadcrumbsComponent,
    ProfileComponent,
    UserDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
