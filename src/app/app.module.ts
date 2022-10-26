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
@NgModule({
  declarations: [
    AppComponent,
    BlankComponent,
    MapComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgAisModule.forRoot(),
    LeafletModule,
    LeafletMarkerClusterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
