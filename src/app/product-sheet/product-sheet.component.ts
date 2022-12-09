import { Component, Input, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {getCurrentUser, getLoggedIn } from '../global-functions/global-functions.module';
import {QUERY, setQuery } from '../data/query';
@Component({
  selector: 'app-product-sheet',
  templateUrl: './product-sheet.component.html',
  styleUrls: ['./product-sheet.component.scss']
})
export class ProductSheetComponent implements OnInit {
  private _router: Router;
  constructor(private route: ActivatedRoute, private http: HttpClient,_router: Router) { this._router = _router; }

  barcode:any
  loading:boolean=true
  product:any
  trashType:any
  update:boolean=false
  productError:any = {
    status: false,
    message: ''
  }
  selectedType:any
  types:any
  ngOnInit(): void {
    if (getLoggedIn() === false) {
      this._router.navigateByUrl('/connexion')
      return
    }
    let loadingElement=document.getElementById('loading-text')
    setInterval(() => {
      if (this.loading===true) {
        if (loadingElement && loadingElement.textContent==='Chargement...') {
          loadingElement.textContent = 'Chargement.'
        } else if (loadingElement && loadingElement.textContent==='Chargement.') {
          loadingElement.textContent = 'Chargement..'
        } else if (loadingElement) {
          loadingElement.textContent = 'Chargement...'
        }
      }
    },400)
    let paramValue:any = this.route.params
    this.barcode=paramValue['_value'].barcode
    let start = new Promise((resolve, reject) => {
      let checkBarcode:any
      let barcodeFormdata:any = new FormData()
      barcodeFormdata.append('barcode',this.barcode)
      barcodeFormdata.append('user',getCurrentUser().id)
      resolve(checkBarcode = this.http.post('http://127.0.0.1:8000/api/check-barcode',barcodeFormdata).toPromise());
    }).then((res:any) => {
      if (res.history) {
        this.product=res.history
        this.selectedType=this.product.typeId
      } else {
        this.productError.status=true
        this.productError.message=res.message
        this.loading=false
      }
      this.pickTrashType()
      this.loading=false
      }
    ).catch((e) => {
    });
  }
  pickTrashType() {
    if (this.product.type==='Emballages en verre') {
      this.trashType= 'benne à verre'
    } else if (this.product.type==='Ordures ménagères') {
      this.trashType= 'benne à ordures ménagères'
    } else if (this.product.type==='Emballages recyclables') {
      this.trashType= 'benne à ordures recyclables'
    } else if (this.product.type==='Textile') {
      this.trashType= 'benne à Textiles'
    }
  }
  updateInit() {
    if (this.product.type.includes('Textile')) {
      this.product.badgeId=4
    } else if (this.product.type.includes('recyclable')) {
      this.product.badgeId=1
    } else if (this.product.type.includes('verre')) {
      this.product.badgeId=2
    } else {
      this.product.badgeId=3
    }
    if(this.update===false) {
      this.loading=true
      let link = setQuery(QUERY.GET.ALL_TYPES)
      this.http.get(link).subscribe((res:any) => {
        res.map((e:any )=> {
          if (e.name.includes('Textile')) {
            e.badgeId=4
          } else if (e.name.includes('recyclable')) {
            e.badgeId=1
          } else if (e.name.includes('verre')) {
            e.badgeId=2
          } else {
            e.badgeId=3
          }
        })
        this.types = res
        this.update=true
        this.loading=false
      })
    } else {
      this.update=false
    }
  }
  updateConfirm() {
    let data=new FormData()
    data.append('id',this.product.id)
    data.append('type',this.selectedType.split('|')[0])
    data.append('oldBadgeId',this.product.badgeId)
    data.append('badgeId',this.selectedType.split('|')[1])
    data.append('user',getCurrentUser().id.toString())
    this.loading=true

    let start = new Promise((resolve, reject) => {
      resolve(this.http.post('http://127.0.0.1:8000/api/history/'+this.product.id+'?_method=PUT',data).toPromise());
    }).then((res:any) => {
      window.location.reload()
    })
  }

}
