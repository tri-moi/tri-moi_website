import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {NgAisModule} from 'angular-instantsearch';
import {BarcodeScannerLivestreamModule} from "ngx-barcode-scanner";

import {AppComponent} from './app.component';
import {BlankComponent} from './blank/blank.component';
import {MapComponent} from './map/map.component';
import {SearchComponent} from './search/search.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {HomeComponent} from './home/home.component';
import {ProfilComponent} from './profil/profil.component';
import {HistoriqueComponent} from './historique/historique.component';
import {BadgeComponent} from './badge/badge.component';
import {FormsModule} from '@angular/forms';
import {ErrorBoxComponent} from './error-box/error-box.component';
import {RegisterComponent} from './register/register.component';
import {HttpClientModule} from "@angular/common/http";
import {ScannerComponent} from './scanner/scanner.component';
import {ProductSheetComponent} from './product-sheet/product-sheet.component';
import {ParametreComponent} from './parametre/parametre.component';


@NgModule({
  declarations: [
    AppComponent,
    BlankComponent,
    ErrorBoxComponent,
    RegisterComponent,
    BlankComponent,
    MapComponent,
    SearchComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProfilComponent,
    HistoriqueComponent,
    BadgeComponent,
    ScannerComponent,
    ProductSheetComponent,
    ParametreComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgAisModule.forRoot(),
    LeafletModule,
    LeafletMarkerClusterModule,
    FormsModule,
    HttpClientModule,
    BarcodeScannerLivestreamModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
};
