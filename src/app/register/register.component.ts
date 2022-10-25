import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';

import { getLoggedIn } from '../global-functions/global-functions.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private _router: Router;

  constructor(_router: Router,private route: ActivatedRoute) {
    this._router = _router;
  }

  // @ts-ignore
  formData = {
    email: null,
    password: null,
    firstName:null,
    lastName:null,
    birthday:null,
    profilePic:null,
  }
  // @ts-ignore
  errors = {
    email:null,
    password:null,
    profilePic:null,
    name:null,
  }
  step2 = false

  ngOnInit(): void {
    if (getLoggedIn()) {
      this._router.navigateByUrl('/')
      return
    }
  }
  toggleStep2() {
    // @ts-ignore
    if ( !this.formData.email || !this.checkEmailFormat(this.formData.email)) {
      // @ts-ignore
      this.errors.email = "Veuillez entrer une adresse e-mail valide."
    } else {
      // @ts-ignore
      if (!this.checkEmailAvailability(this.formData.email)) {
        // @ts-ignore
        this._router.navigateByUrl('/login?action=alreadyExists&email='+this.formData.email)
        return
      } else {
        this.errors.email=null
        this.step2 = !this.step2
      }
    }
  }
  checkEmailFormat(string:string) {
    return string.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
  }
  checkEmailAvailability(string:string) {
    return 1
  }
  checkPasswordFormat(string:string) {
    //1 lettre maj, 1 lettre min, 1 chiffre minimum, entre 6 et 30 caractères
    return string.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/)
  }
  submitRegister() {
    console.log(this.formData)
    if (this.step2) {
      console.log('submit')
      // @ts-ignore
      if (!this.formData.password || !this.checkPasswordFormat(this.formData.password)) {
        // @ts-ignore
        this.errors.password = "Votre mot de passe doit contenir entre 6 et 30 caractères, au mois une lettre majuscule, une lettre minuscule, et un chiffre."
      }
      else {
        this.errors.password=null
      }
      if (!this.formData.firstName || !this.formData.firstName) {
        // @ts-ignore
        this.errors.name = "Veuillez entrer votre nom et votre prénom."
      }
      else {
        this.errors.name=null
      }
      if(Object.values(this.errors).every(element => element === null)) {

      }
    }
  }

}
