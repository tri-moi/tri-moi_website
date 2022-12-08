import {Component, OnInit, ViewChild} from '@angular/core';
import { getLoggedIn } from '../global-functions/global-functions.module';
import { LoggedInService } from '../logged-in.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('menuCheckbox') menuCheckbox:any;

  constructor(private authenticationService: LoggedInService) {
    this.authenticationService.loginStatusChange().subscribe((loggedIn:any )=> {
      console.log('loggedIn',loggedIn)
      if (loggedIn===true) {
        this.login=true
      } else {
        this.login=false
      }
    });
  }

  login:boolean

  closeMenu(){
    console.log(this.menuCheckbox)
    this.menuCheckbox.nativeElement.checked = false;
    console.log(this.menuCheckbox)

  }

  ngOnInit(): void {
    // if (getLoggedIn()) {
    //   this.authenticationService.login()
    // } else {
    //   this.authenticationService.logout()
    // }
    console.log('header')
    this.authenticationService.loginStatusChange().subscribe((loggedIn:any )=> {
      console.log('loggedIn',loggedIn)
    });
    // const isLoggedIn = JSON.parse(localStorage.getItem("user") ?? "{}").isLoggedIn
    // isLoggedIn === true ? this.login = true : this.login = false
  }

  getLocalStorage(): any {
    const jsonData = localStorage.getItem('user')
    return JSON.parse(jsonData != null ? jsonData : "");
  }

  get userProfilPic(): any {
    const user = this.getLocalStorage()
    return user.profilePicture
  }
}
