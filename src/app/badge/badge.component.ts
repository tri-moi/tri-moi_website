import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {QUERY, setQuery} from "../data/query";
import { getCurrentUser, getLoggedIn } from '../global-functions/global-functions.module';

interface badges {
  recyclables:any
  verre:any
  menageres:any
  textiles:any
  }

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {
  private _router: Router;
  constructor(private http: HttpClient,_router: Router) { this._router = _router; }


  loading:boolean=true
  badges:any=[]

  ngOnInit(): void {
    if (getLoggedIn() === false) {
      this._router.navigateByUrl('/auth')
      return
    }
    let link = setQuery(QUERY.GET.ALL_BADGES,{user:getCurrentUser().id})
    this.http.get(link).subscribe((res:any) => {
      let recyclables:any=[]
      let verre:any=[]
      let menageres:any=[]
      let textiles:any=[]
      let categories   = []
      Object.values(res.badges).forEach((item:any) => {
        if (item.badge.id ===1) {
          item.image='recyclable'
          recyclables.push(item)
        } else if (item.badge.id ===2) {
          item.image='glass'
          verre.push(item)
        } else if (item.badge.id ===3) {
          item.image='household'
          menageres.push(item)
        } else if (item.badge.id ===4) {
          item.image='textile'
          textiles.push(item)
        }
      })
      categories.push(recyclables)
      categories.push(verre)
      categories.push(menageres)
      categories.push(textiles)
      this.badges=categories
      this.loading=false
    })
  }

}
