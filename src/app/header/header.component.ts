import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('menuCheckbox') menuCheckbox:any;

  constructor() { }

  login = false

  closeMenu(){
    console.log(this.menuCheckbox)
    this.menuCheckbox.nativeElement.checked = false;
    console.log(this.menuCheckbox)

  }

  ngOnInit(): void {
    const isLoggedIn = JSON.parse(localStorage.getItem("user") ?? "{}").isLoggedIn
    isLoggedIn === true ? this.login = true : this.login = false
  }
}
