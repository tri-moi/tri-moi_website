import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {QUERY, setQuery } from '../data/query';
import { getCurrentUser } from '../global-functions/global-functions.module';
import {User} from "../type/User";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  loading=true
  products:number
  badges:number
  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    let loadingElement=document.getElementById('loading-text')
    setInterval(() => {
      if (this.loading===true) {
        if (loadingElement && loadingElement.textContent==='Chargement...') {
          loadingElement.textContent = 'Chargement.'
        } else if (loadingElement && loadingElement.textContent==='Chargement.') {
          loadingElement.textContent = 'Chargement..'
        } else if (loadingElement && loadingElement.textContent==='Chargement..') {
          loadingElement.textContent = 'Chargement...'
        }
      }
    },400)
    this.getNumber()
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
  getNumber() {
    let test = new Promise((resolve, reject) => {
      resolve(this.http.get('http://127.0.0.1:8000/api/productCounts/'+getCurrentUser().id).toPromise());
    }).then((res:any) => {
      let link = setQuery(QUERY.GET.ALL_BADGES,{user:getCurrentUser().id})
      this.http.get(link).subscribe((res:any) => {
        let badgesUnlocked=res.badges.filter((e:any)=>{
          return e.scanNumber>=e.level.goal
        })
        this.badges=badgesUnlocked.length
        this.loading=false
      })
      this.products = res.total
    })
  }
}
