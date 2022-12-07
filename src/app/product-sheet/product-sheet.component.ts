import { Component, Input, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {getCurrentUser, getLoggedIn } from '../global-functions/global-functions.module';
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
  productError:any = {
    status: false,
    message: ''
  }
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
        console.log(res)
      if (res.history) {
        this.product=res.history
      } else {
        this.productError.status=true
        this.productError.message=res.message
      }
      this.pickTrashType()
      this.loading=false
      }
    ).catch((e) => {
      console.log("Error : ",e)
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

}
