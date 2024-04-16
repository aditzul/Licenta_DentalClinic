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
        },
        {
          displayName: 'Patients',
          route: 'patients',
          iconName: 'fa-hospital-user',
        },
        {
          displayName: 'Appointments',
          route: 'appointments',
          iconName: 'fa-calendar-alt',
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
            {
              displayName: 'SMSO API',
              route: 'admin/smso-api',
              iconName: 'fa-cubes',
            }
          ]
        },
        {
          displayName: 'Settings',
          iconName: 'fa-cog',
          children: [
            {
              displayName: 'Communication',
              route: 'settings/communication',
              iconName: 'fa-comments',
            },
            {
              displayName: 'Forms',
              route: 'settings/forms',
              iconName: 'fa-file-alt',
            },
            {
              displayName: 'Company Data',
              route: 'settings/company-data',
              iconName: 'fa-building',
            },
            {
              displayName: 'Works',
              route: 'settings/works',
              iconName: 'fa-tools',
            },
            {
              displayName: 'Conditions',
              route: 'settings/conditions',
              iconName: 'fa-heartbeat',
            }
          ]
        },      
      ];
    });
  }

  get isAdmin() {
    return this.user?.role === Role.Admin;
  }

  logout() {
    this.authenticationService.logout();
  }
}
