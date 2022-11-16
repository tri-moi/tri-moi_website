import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";
import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {QUERY, setQuery} from "../data/query";
import { getLoggedIn, getCurrentUser } from '../global-functions/global-functions.module';
import { Router } from "@angular/router";

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})

export class ScannerComponent implements AfterViewInit, OnInit {
  private _router: Router;
  constructor(private http: HttpClient,_router: Router) { this._router = _router; }
  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner:BarcodeScannerLivestreamComponent;
  barcodeValue:any;
  currentProduct:any = {
    status:null
  };
  error:any = {
    status:false,
    message: 'Veuillez choisir un type de produit.'
  }
  types:any=[];
  selectedType:any
  scannerLoading:boolean=true
  ngOnInit(): void {
    if (getLoggedIn() === false) {
      this._router.navigateByUrl('/connexion')
      return
    }
    let link = setQuery(QUERY.GET.ALL_TYPES)
    this.http.get(link).subscribe((res) => {
      console.log(res)
      this.types = res
    })
  }
  ngAfterViewInit(): void {

    setInterval(() => {
      if (this.scannerLoading===true) {
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
    let start = new Promise((resolve, reject) => {
      resolve(this.barcodeScanner.start());
    }).then(() => {
        this.scannerLoading = false
        console.log(this.scannerLoading)
      }
    ).catch((e) => {
      console.log("couldn't start scanner : ",e)
    });

  }

  async scan(result:any) {
    this.currentProduct.status=null
    this.scannerLoading = true
    this.barcodeValue='3017620422003'
    let barcodeFormdata = new FormData()
    barcodeFormdata.append('barcode',this.barcodeValue)
    let checkBarcode:any = {}
    checkBarcode = await this.http.post('http://127.0.0.1:8000/api/check-barcode',barcodeFormdata).toPromise()
    console.log(checkBarcode)
    if (checkBarcode.message !=='success') {
      let productData:any = {}
      productData = await this.http.get('https://world.openfoodfacts.org/api/v0/product/'+this.barcodeValue+'.json').toPromise()
      this.currentProduct=productData
      console.log(this.currentProduct)
    } else {
      this._router.navigateByUrl('/product/'+this.barcodeValue)
      return
    }
    this.scannerLoading = false
    if (this.currentProduct.status===1) {
      this.barcodeScanner.stop();
    }
  }
  async sendData() {
    if (this.selectedType) {
      this.error.status = false
      console.log(this.selectedType)
      let data= new FormData()
      let date = new Date()
      data.append('name',this.currentProduct.product.product_name)
      data.append('brand',this.currentProduct.product.brands)
      data.append('barcode',this.barcodeValue)
      data.append('image',this.currentProduct.product.image_url)
      data.append('type',this.selectedType.toString())
      // @ts-ignore
      data.append('user',JSON.parse(getCurrentUser()).id.toString())
      console.log(data.get('name'))
      let link = setQuery(QUERY.POST.CREATE_HISTORY)
      let sentProduct = await this.http.post(link,data).toPromise()
      this._router.navigateByUrl('/product/'+this.barcodeValue)
      return
    }
    else {
      console.log('error')
      this.error.status = true
    }
  }
}
