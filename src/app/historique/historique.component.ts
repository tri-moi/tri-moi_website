import { HttpClient } from '@angular/common/http';
import { getLoggedIn, getCurrentUser } from '../global-functions/global-functions.module';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent implements OnInit {
  private _router: Router;
  constructor(private http: HttpClient,_router: Router) { this._router = _router;  }

  loading:boolean=true
  page:number=1
  history:any=[]

  ngOnInit(): void {
    if (getLoggedIn() === false) {
      this._router.navigateByUrl('/auth')
      return
    }
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
    let history = new Promise((resolve, reject) => {
      // @ts-ignore
      resolve(this.http.get('http://127.0.0.1:8000/api/historyByUser/' + getCurrentUser().id+'?page='+this.page).toPromise());
    }).then((res: any) => {
      console.log(res)
      this.loading = false
      this.history=res
    })
  }

}
