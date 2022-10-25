import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { getLoggedIn } from '../global-functions/global-functions.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private _router: Router;

  constructor(_router: Router,private route: ActivatedRoute) {
    this._router = _router;
  }

  fromRegister=false
  // @ts-ignore
  formData = {
    email: null,
    password: null,
  }
  // @ts-ignore
  errorLogin:boolean

  ngOnInit(): void {
    let action = null
    getLoggedIn()
     this.route.queryParams
      .subscribe(params => {
        action = params['action']
        if (action === 'logout') {
          //Checks if user is actually logged in, if not, redirects to the login page
          if (!getLoggedIn()) {
            this._router.navigateByUrl('/login')
            return
          }
          localStorage.removeItem('user')
          localStorage.setItem('isLoggedIn', 'false')
          this._router.navigateByUrl('/')
        } else if (action === 'alreadyExists') {
          let email = params['email']
          this.fromRegister = true
          this.formData.email = email
        }
      })
  }

  submitLogin() {
    if (this.formData.email && this.formData.password) {
      this.errorLogin = false
      let user= {
        isLoggedIn: true,
        user: {
          username:this.formData.email,
          password:this.formData.password
        }
      }
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isLoggedIn', 'true')
      this._router.navigateByUrl('/')
    } else {
      this.errorLogin = true
      console.log('error')
    }
  }

}
