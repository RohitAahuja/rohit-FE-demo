import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticateService } from './services';
import { User } from './models';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUser: User;

  constructor(
    private router: Router,
    private authenticateService: AuthenticateService,
  ) {
    this.authenticateService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticateService.logout();
    this.router.navigate(['/login']);
  }
}


