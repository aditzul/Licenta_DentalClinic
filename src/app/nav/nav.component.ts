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
          displayName: 'Tablou bord',
          route: 'dashboard',
          iconName: 'fa-chart-line',
        },
        {
          displayName: 'Pacienți',
          route: 'patients',
          iconName: 'fa-hospital-user',
        },
        {
          displayName: 'Programări',
          route: 'appointments',
          iconName: 'fa-calendar-alt',
        },
        {
          displayName: 'Setări',
          route: 'settings',
          iconName: 'fa-cog',
        },
        {
          displayName: 'Admin',
          iconName: 'fa-user-gear',
          hidden: !this.isAdmin,
          children: [
            {
              displayName: 'Utilizatori',
              route: 'admin/users',
              iconName: 'fa-users',
            },
            {
              displayName: 'API SMSO',
              route: 'admin/smso-api',
              iconName: 'fa-cubes',
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
