import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {getLoggedIn} from '../global-functions/global-functions.module';
import {QUERY, setQuery} from "../data/query";
import {HttpClient} from "@angular/common/http";

interface IFormData {
  email: string | null;
  passwordLogin: string | null,
  passwordRegister: string | null,
  passwordRegisterConfirm: string | null,
  firstName: string | null,
  lastName: string | null,
}

interface IFormErrors {
  email: string | null;
  password: string | null,
  name: string | null,
  passwordDouble: string | null,
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  private _router: Router;

  constructor(_router: Router, private route: ActivatedRoute, private _http: HttpClient) {
    this._router = _router;
  }


  formData: IFormData = {
    email: null,
    passwordLogin: null,
    passwordRegister: null,
    passwordRegisterConfirm: null,
    firstName: null,
    lastName: null,
  }

  errors: IFormErrors = {
    email: null,
    password: null,
    name: null,
    passwordDouble: null,
  }

  step = false
  stepLogin = false
  stepRegister = false

  ngOnInit(): void {
    if (getLoggedIn()) {
      localStorage.removeItem('user')
      this._router.navigateByUrl("/")
    }
  }

  checkMail = (email: string) => {
    if (this.checkEmailFormat(email)) {
      let link = setQuery(QUERY.AUTH.CHECK_EMAIL)
      const formData = new FormData();
      formData.append('email', email);
      this._http.post(link, formData).subscribe((data: any) => {
        if (data.exists === true) {
          this.stepLogin = true
          this.stepRegister = false
          this.errors.email = null
          console.log('login')
          console.log("this.stepRegister", this.stepRegister, "this.stepLogin", this.stepLogin)
        } else {
          this.errors.email = null
          this.stepLogin = false
          this.stepRegister = true
          console.log("this.stepRegister", this.stepRegister, "this.stepLogin", this.stepLogin)
        }
        console.log(data)
      })
      this.step = true
    } else {
      this.errors.email = "Veuillez renseigner un email valide"
    }

  }

  toggleStep() {
    if (this.formData.email) {
      if (this.step) {
        this.stepLogin = false
        this.stepRegister = false
        this.step = false
      } else {
        this.checkMail(this.formData.email)
      }
    } else {
      this.errors.email = "Veuillez renseigner un email"
    }
  }

  error = false

  submit() {
    if (this.stepLogin) {
      const formData = new FormData();
      if (this.formData.email && this.formData.passwordLogin) {
        formData.append('email', this.formData.email);
        formData.append('password', this.formData.passwordLogin);
        let link = setQuery(QUERY.AUTH.LOGIN)
        this._http.post(link, formData).subscribe((data: any) => {
          console.log("connexion", data)
          if (data.success === true) {
            data.user = {...data.user, isLoggedIn: true}
            localStorage.setItem('user', JSON.stringify(data.user));
            this._router.navigateByUrl("/");
          } else {
            this.errors.password = "Mot de passe incorrect"
          }
        })
      } else {
        //TODO: error message to display on the form (email or password missing)
      }
    } else if (this.stepRegister) {
      // TODO : mettre en place le formulaire d'inscription
    }
  }

  checkEmailFormat(string: string) {
    return string.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
  }

  checkEmailAvailability(string: string) {
    return 1
  }

  checkPasswordFormat(string: string) {
    //1 lettre maj, 1 lettre min, 1 chiffre minimum, entre 8 et 30 caractères
    return string.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$/)
  }

}
