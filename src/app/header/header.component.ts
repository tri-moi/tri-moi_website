import {Component, OnInit, ViewChild} from '@angular/core';
import { LoggedInService } from '../logged-in.service';
import {User} from "../type/User";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('menuCheckbox') menuCheckbox: any;

  constructor(private authenticationService: LoggedInService) {
    this.authenticationService.loginStatusChange().subscribe((loggedIn:any )=> {
      if (loggedIn===true) {
        this.login=true
      } else {
        this.login=false
      }
    });
  }

  login:boolean

  closeMenu() {
    this.menuCheckbox.nativeElement.checked = false;

  }

  ngOnInit(): void {
    this.authenticationService.loginStatusChange().subscribe((loggedIn:any )=> {
    });
  }

  getLocalStorage(): any {
    const jsonData = localStorage.getItem('user')
    return JSON.parse(jsonData != null ? jsonData : "");
  }

  get userIdUser(): any {
    const user: User = this.getLocalStorage()
    return user.id
  }
}
