import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuOpen = false;

  constructor() {
  }

  openMenu() {
    this.menuOpen = !this.menuOpen;
  }

  login = false

  ngOnInit(): void {
    const isLoggedIn = JSON.parse(localStorage.getItem("user") ?? "{}").isLoggedIn
    isLoggedIn === true ? this.login = true : this.login = false
  }
}
