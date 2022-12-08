import {Component, OnInit} from '@angular/core';
import {User} from "../type/User";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  getLocalStorage(): any {
    const jsonData = localStorage.getItem('user')
    return JSON.parse(jsonData != null ? jsonData : "");
  }

  get userFirstName(): any {
    const user = this.getLocalStorage()
    return user.firstName
  }

  get userLastName(): any {
    const user = this.getLocalStorage()
    return user.lastName
  }

  get userEmail(): any {
    const user = this.getLocalStorage()
    return user.email
  }

  get userIdUser(): any {
    const user: User = this.getLocalStorage()
    return user.id
  }
}
