import {BarcodeScannerLivestreamComponent} from "ngx-barcode-scanner";
import {Component, ViewChild, AfterViewInit, OnInit} from "@angular/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {QUERY, setQuery} from "../data/query";
import {getLoggedIn, getCurrentUser} from '../global-functions/global-functions.module';
import {Router} from "@angular/router";

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})

export class ScannerComponent implements AfterViewInit, OnInit {
  private _router: Router;

  constructor(private http: HttpClient, _router: Router) {
    this._router = _router;
  }

  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner:BarcodeScannerLivestreamComponent;
  barcodeValue:any='';
  barcodeInput:string |  number = ''
  currentProduct:any = {
    status:null
  };
  error: any = {
    status: false,
    message: 'Veuillez choisir un type de produit.'
  }
  types: any = [];
  selectedType: any
  scannerLoading: boolean = true

  ngOnInit(): void {
    if (!getLoggedIn()) {
      this._router.navigateByUrl('/auth')
      return
    }
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
      console.log(res)
      this.types = res
    })
  }

  ngAfterViewInit(): void {

    let loadingElement = document.getElementById('loading-text')
    setInterval(() => {
      if (this.scannerLoading) {
        if (loadingElement && loadingElement.textContent === 'Chargement...') {
          loadingElement.textContent = 'Chargement.'
        } else if (loadingElement && loadingElement.textContent === 'Chargement.') {
          loadingElement.textContent = 'Chargement..'
        } else if (loadingElement) {
          loadingElement.textContent = 'Chargement...'
        }
      }
    }, 400)
    let start = new Promise((resolve, reject) => {
      resolve(this.barcodeScanner.start());
    }).then(() => {
        this.scannerLoading = false
        console.log(this.scannerLoading)
      }
    ).catch((e) => {
      console.log("couldn't start scanner : ", e)
    });

  }

  async scan(result:any) {
    if(this.barcodeScanner) {
      this.barcodeScanner.stop()
    }
    console.log(result)
    this.scannerLoading=true
    if (result.codeResult) {
      this.barcodeValue=result.codeResult.code
    } else if (this.barcodeInput!=='') {
      this.barcodeValue=this.barcodeInput
    } else {
      this.barcodeValue='3168930159896'
    }
    this.currentProduct.status=null
    this.scannerLoading = true
    let barcodeFormdata = new FormData()
    barcodeFormdata.append('barcode', this.barcodeValue)
    barcodeFormdata.append('user', getCurrentUser().id)
    console.log(barcodeFormdata)
    let checkBarcode: any = {}
    checkBarcode = await this.http.post('http://127.0.0.1:8000/api/check-barcode', barcodeFormdata).toPromise()
    console.log(checkBarcode)
    if (checkBarcode.message !== 'success') {
      let productData: any = {}
      productData = await this.http.get('https://world.openfoodfacts.org/api/v0/product/' + this.barcodeValue + '.json').toPromise()
      this.currentProduct = productData
      console.log(this.currentProduct)
    } else {
      this._router.navigateByUrl('/product/' + this.barcodeValue)
      return
    }
    this.scannerLoading = false
    if (this.currentProduct.status===1) {

    } else {
      this.barcodeScanner.start()
    }
  }

  async sendData() {
    if (this.selectedType) {
      this.error.status = false
      console.log(this.selectedType)
      let data= new FormData()
      let badge = '%"id":'+this.selectedType.split('|')[1]+'%'
      data.append('name',this.currentProduct.product.product_name)
      data.append('brand',this.currentProduct.product.brands)
      data.append('barcode',this.barcodeValue)
      data.append('image',this.currentProduct.product.image_url)
      data.append('type',this.selectedType.split('|')[0])
      data.append('user',getCurrentUser().id.toString())
      data.append('badge',badge)
      console.log(data.get('name'))
      let link = setQuery(QUERY.POST.CREATE_HISTORY)
      let sentProduct = await this.http.post(link, data).toPromise()
      this._router.navigateByUrl('/product/' + this.barcodeValue)
      return
    } else {
      console.log('error')
      this.error.status = true
    }
  }
}
