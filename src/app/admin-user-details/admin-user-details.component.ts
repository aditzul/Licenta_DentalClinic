import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-details',
  templateUrl: './admin-user-details.component.html',
  styleUrls: ['./admin-user-details.component.scss'],
})
export class AdminUserDetailsComponent {
  constructor(private route: ActivatedRoute, private router: Router) {
    const xxx = this.route.snapshot.params['id'];
  }
}
