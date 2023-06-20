import { Component } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: User | null = null;
  constructor(authenticationService: AuthenticationService){
    authenticationService.user.subscribe(
      (user: User | null) => (this.user = user)
    );
  }
}
