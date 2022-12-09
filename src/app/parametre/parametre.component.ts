import {Component, OnInit} from '@angular/core';
import {User} from "../type/User";
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {QUERY, setQuery} from "../data/query";
import {FileUploadService} from "../file-upload.service";

type stateButton = boolean;

interface IDataForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture: string;
  birthDate: string;
}

interface Ibuttons {
  lastName: stateButton;
  firstName: stateButton;
  email: stateButton;
  password: stateButton;
  birthDate: stateButton;
  profilePicture: stateButton;
}


@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.scss']
})

export class ParametreComponent implements OnInit {

  private _router: Router;

  constructor(_router: Router, private route: ActivatedRoute, private _http: HttpClient, private fileUploadService: FileUploadService) {
    this._router = _router;
  }


  ngOnInit(): void {
  }

  userData: User = JSON.parse(localStorage.getItem('user') || '{}');

  formData: IDataForm = {
    firstName: this.userData.firstName || '',
    lastName: this.userData.lastName || '',
    email: this.userData.email || '',
    password: '',
    confirmPassword: '',
    profilePicture: this.userData.profilePicture || '',
    birthDate: this.userData.birthDate.date.split(" ")[0] || ''
  };


  button: Ibuttons = {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    profilePicture: false,
    birthDate: false
  }


  sendData(link: string, formData: any, name: "profilePicture" | "birthDate" | "email" | "password" | "lastName" | "firstName", _http: HttpClient = this._http): void {
    this._http.post(link, formData).subscribe((data: any) => {
      let user: User = data.data
      user = {...user, isLoggedIn: true};
      localStorage.setItem('user', JSON.stringify(user));
      this.userData = user;
      this.resetInput(name);
    });
  }

  buttonClick(e: any): void {
    const name: string = e.target.name;
    const link = setQuery(QUERY.PUT.UPDATE_USER, this.userData.id)
    if (name === "profilePicture" || name === "birthDate" || name === "email" || name === "password" || name === "lastName" || name === "firstName") {
      this.button[name] = false;
      const formData = new FormData();
      formData.append(name, this.formData[name]);
      formData.append('type', name);
      this.sendData(link, formData, name);
    }
  }


  onChange(e: any): void {
    const name: string = e.target.name;
    const value = e.target.value;
    if (name === "birthDate" || name === "email" || name === "password" || name === "lastName" || name === "firstName") {
      if (this.userData[name] !== value) {
        this.button[name] = true;
        this.formData[name] = value;
      } else {
        this.button[name] = false;
      }
    } else if (name === "profilePicture") {
      this.file = e.target.files[0];
      if (this.file) {
        this.button[name] = true;
      } else {
        this.button[name] = false;
      }
    } else {
    }
  }

  resetInput(name: string): void {
    if (name === "birthDate" || name === "email" || name === "password" || name === "lastName" || name === "firstName") {
      if (name === "birthDate") {
        this.formData[name] = this.userData[name].date.split(" ")[0];
      } else {
        this.formData[name] = this.userData[name];
      }
      this.button[name] = false;
    }
  }

  shortLink: string = "";
  file: File | null = null; // Variable to store file

  // Inject service
  // On file Select
  onUpload() {
    if (this.file) {
      this.fileUploadService.upload(this.file).subscribe((event: any) => {
        if (typeof (event) === 'object') {

          // Short link via api response
          this.shortLink = event.link;
        }

        const link = setQuery(QUERY.GET.PROFILE_PICTURE, this.userData.id)
        const img_profil_pic = document.getElementById("img_profil_pic");
        if (img_profil_pic) {
          img_profil_pic.setAttribute("src", link);
        }
      })
      this.button.profilePicture = false;
    }
  }
}
