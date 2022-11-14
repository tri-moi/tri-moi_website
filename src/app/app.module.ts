import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgAisModule } from 'angular-instantsearch';

import { AppComponent } from './app.component';
import { BlankComponent } from './blank/blank.component';
import { MapComponent } from './map/map.component';
import { SearchComponent } from './search/search.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {ErrorBoxComponent} from './error-box/error-box.component';
import {RegisterComponent} from './register/register.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BlankComponent,
    ErrorBoxComponent,
    RegisterComponent,
    BlankComponent,
    MapComponent,
    SearchComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgAisModule.forRoot(),
    LeafletModule,
    LeafletMarkerClusterModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
};

