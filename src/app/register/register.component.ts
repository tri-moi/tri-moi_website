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
  general: string | null,
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

  loading: boolean = false
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
    general: null,
  }

  step = false
  stepLogin = false
  stepRegister = false

  ngOnInit(): void {
    const loadingElement = document.getElementById('loading-text')
    setInterval(() => {
      if (loadingElement) {
        if (this.loading) {
          if (loadingElement.textContent === 'Chargement...') {
            loadingElement.textContent = 'Chargement.'
          } else if (loadingElement.textContent === 'Chargement.') {
            loadingElement.textContent = 'Chargement..'
          } else {
            loadingElement.textContent = 'Chargement...'
          }
        }
      }
    }, 400)
    if (getLoggedIn()) {
      localStorage.removeItem('user')
      this._router.navigateByUrl("/")
    }
  }

  checkMail = (email: string) => {
    this.loading = true
    if (this.checkEmailFormat(email)) {
      let link = setQuery(QUERY.AUTH.CHECK_EMAIL)
      const formData = new FormData();
      formData.append('email', email);
      this._http.post(link, formData).subscribe((data: any) => {
        if (data.exists === true) {
          this.stepLogin = true
          this.stepRegister = false
          this.errors.email = null
        } else {
          this.errors.email = null
          this.stepLogin = false
          this.stepRegister = true
        }
        this.loading = false
      })
      this.step = true
    } else {
      this.errors.email = "Veuillez renseigner un email valide"
    }

  }

  toggleStep() {
    this.errors = {
      email: null,
      password: null,
      name: null,
      passwordDouble: null,
      general: null,
    }
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
    this.errors = {
      email: null,
      password: null,
      name: null,
      passwordDouble: null,
      general: null,
    }
    const formData = new FormData();
    if (this.stepLogin) {
      if (this.formData.email && this.formData.passwordLogin) {
        this.loading = true
        formData.append('email', this.formData.email);
        formData.append('password', this.formData.passwordLogin);
        let link = setQuery(QUERY.AUTH.LOGIN)
        this._http.post(link, formData).subscribe((data: any) => {
          this.loading = false
          if (data.success === true) {
            data.user = {...data.user, isLoggedIn: true}
            localStorage.setItem('user', JSON.stringify(data.user));
            this._router.navigateByUrl("/");
            return
          } else {
            this.errors.password = "Mot de passe incorrect."
          }

        })
      } else {
        this.errors.password = "Veuillez entrer un mot de passe."
      }
    } else if (this.stepRegister) {
      // TODO : mettre en place le formulaire d'inscription
      if (this.formData.email && this.formData.passwordRegister && this.formData.passwordRegisterConfirm && this.formData.firstName && this.formData.lastName) {
        formData.append('email', this.formData.email);
        formData.append('password', this.formData.passwordRegister);
        formData.append('password_confirm', this.formData.passwordRegisterConfirm);
        formData.append('first_name', this.formData.firstName);
        formData.append('last_name', this.formData.lastName);
        if (this.formData.passwordRegisterConfirm !== this.formData.passwordRegister) {
          this.errors.passwordDouble = 'Veuillez entrer 2 mots de passe identiques.'
        } else if (!this.checkPasswordFormat(this.formData.passwordRegister)) {
          this.errors.password = 'Votre mot de passe doit contenir entre 8 et 30 caractères, y compris au moins un cheffre, une lettre majuscule et une lettre minuscule.'
        } else {
          this.loading = true
          let link = setQuery(QUERY.AUTH.REGISTER)
          this._http.post(link, formData).subscribe((data: any) => {
            if (data.success === true) {
              this._router.navigateByUrl("/");
            } else {
              this.errors = data.error
            }
            this.loading = false
          })
        }
      } else {
        //TODO: error message to display on the form (email or password missing)
        this.errors.general = 'Veuillez remplir tous les champs.'
      }
    }
  }

  checkEmailFormat(string: string) {
    return string.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
  }


  checkPasswordFormat(string: string) {
    //1 lettre maj, 1 lettre min, 1 chiffre minimum, entre 8 et 30 caractères
    return string.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$/)
  }

}
