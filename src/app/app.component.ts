import { Component, OnInit } from '@angular/core';
import { getLoggedIn } from './global-functions/global-functions.module';
import { LoggedInService } from './logged-in.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'my-app';
  constructor(private authenticationService: LoggedInService) {}
  ngOnInit():void {
    if (getLoggedIn()) {
      this.authenticationService.login()
    } else {
      this.authenticationService.logout()
    }
  }
}
