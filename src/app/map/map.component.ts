import { Component, AfterViewInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import algoliasearch from 'algoliasearch/lite';
import * as L from 'leaflet';
import { environment } from '../../environments/environment'

const searchClient = algoliasearch(
  environment.algolia_id,
  environment.algolia_key
);
const index = searchClient.initIndex('pav');
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map:any;

  constructor() { }
  loading = true
  filters = ''
  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 10,
    center: L.latLng( 49.443232, 1.099971 )
  };
  layers = [
    L.marker([ 46.879966, -121.726909 ])
  ]

  markerClusterData = {
    addLayer: this.layers,
  }
  ngAfterViewInit(): void {
    index.search('',{hitsPerPage: 50,}).then(({ hits }) => {
      console.log(hits);
      this.pushHitsToMarkers(hits)
      this.loading = false
    });
  }
  pushHitsToMarkers(hits:any) {
    let markers: L.Marker<any>[]=[]
    hits.forEach((hit:object) => {
      // @ts-ignore
      markers.push(L.marker([ hit.fields.geo_point_2d[0], hit.fields.geo_point_2d[1] ]))
    })
    this.layers = markers
  }
  addToFilters(filter:any, value:any) {
    this.filters = filter+':"'+value+'"'
    console.log(this.filters)
    this.loading = true
    index.search('',{hitsPerPage: 50, filters: this.filters}).then(({ hits }) => {
      console.log(hits);
      this.pushHitsToMarkers(hits)
      this.loading = false
    });
  }
}
