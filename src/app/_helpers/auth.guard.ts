import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { Role } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authenticationService.userValue;
    if (user) {
      // check if route is restricted by role
      const { roles } = route.data;
      if (roles && !roles.includes(user.role)) {
        // role not authorized so redirect to home page
        if(user.role == Role.Patient) {
          this.router.navigate(['/patientView']);
          return false;
        }
        this.router.navigate(['/']);
        return false;
      }

      // authorized so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
