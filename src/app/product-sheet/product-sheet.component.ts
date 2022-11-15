import { Component, Input, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import {HttpClient, HttpClientModule} from "@angular/common/http";
@Component({
  selector: 'app-product-sheet',
  templateUrl: './product-sheet.component.html',
  styleUrls: ['./product-sheet.component.scss']
})
export class ProductSheetComponent implements OnInit {
  constructor(private route: ActivatedRoute,private http: HttpClient,_router: Router) { }
  barcode:any
  loading:boolean=true
  product:any
  trashType:any
  productError:any = {
    status: false,
    message: ''
  }
  ngOnInit(): void {
    setInterval(() => {
      if (this.loading===true) {
        // @ts-ignore
        if (document.getElementById('loading-text').textContent==='Chargement...') {
          // @ts-ignore
          document.getElementById('loading-text').textContent = 'Chargement.'
          // @ts-ignore
        } else if (document.getElementById('loading-text').textContent==='Chargement.') {
          // @ts-ignore
          document.getElementById('loading-text').textContent = 'Chargement..'
          // @ts-ignore
        } else {
          // @ts-ignore
          document.getElementById('loading-text').textContent = 'Chargement...'
        }
      }
    },400)
    let barcode:any
    // @ts-ignore
    this.barcode=this.route.params['_value'].barcode
    let start = new Promise((resolve, reject) => {
      let checkBarcode:any
      let barcodeFormdata:any = new FormData()
      barcodeFormdata.append('barcode',this.barcode)
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
    } else if (this.product.type==='Ordures ménagères') {
      this.trashType= 'benne à Textiles'
    }
  }

}
