import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Role, User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { NavItem } from '../_models/nav-item';
import { NavService } from '../_services/nav.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );
  user?: User | null;
  navItems: NavItem[] = [];

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.user.subscribe((user: User | null) => {
      this.user = user;
      this.navItems = [
        {
          displayName: 'Dashboard',
          route: 'dashboard',
          iconName: 'fa-chart-line',
          hidden: this.isPatient,
        },
        {
          displayName: 'Patients',
          route: 'patients',
          iconName: 'fa-hospital-user',
          hidden: this.isPatient,
        },
        {
          displayName: 'Appointments',
          route: 'appointments',
          iconName: 'fa-calendar-alt',
          hidden: this.isPatient,
        },
        {
          displayName: 'Admin',
          iconName: 'fa-user-gear',
          hidden: !this.isAdmin,
          children: [
            {
              displayName: 'Users',
              route: 'admin/users',
              iconName: 'fa-users',
            },
          ],
        },
      ];
    });
  }

  get isAdmin() {
    return this.user?.role === Role.Admin;
  }

  get isPatient() {
    return this.user?.role === Role.Patient;
  }

  logout() {
    this.authenticationService.logout();
  }
}
