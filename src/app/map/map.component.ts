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
  hitsPerPage = 100
  searchQuery = ''
  filters = ''
  hits = []
  center = L.latLng( 49.443232, 1.099971 )
  zoom = 10
  options = {
    attributionControl: false,
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
    ],
  };
  layers = [
    L.marker([ 46.879966, -121.726909 ])
  ]

  markerClusterData = {
    addLayer: this.layers,
  }
  ngAfterViewInit(): void {
    index.search(this.searchQuery,{hitsPerPage: this.hitsPerPage,}).then(({ hits }) => {
      console.log(hits);
      this.pushHitsToMarkers(hits)
      this.loading = false
    });
  }
  pushHitsToMarkers(hits:any) {
    let markers: L.Marker<any>[]=[]
      hits.forEach((hit:any) => {
      let icon = ''
      if (hit.fields.pavtyp === 'Emballages en verre') {
        icon = './assets/images/icons8-glass.png'
      } else if (hit.fields.pavtyp === 'Textile') {
        icon = './assets/images/icons8-textile.png'
      } else if (hit.fields.pavtyp === 'Emballages recyclables') {
        icon = './assets/images/icons8-recyclable.png'
      } else {
        icon = './assets/images/icons8-household.png'
      }
      // @ts-ignore
      markers.push(L.marker([ hit.fields.geo_point_2d[0], hit.fields.geo_point_2d[1] ], {
        icon: L.icon({
          iconUrl: icon,
          iconSize: [34, 40 ],
          iconAnchor:   [17, 42],
        })
      }))
    })
    this.layers = markers
  }
  addToFilters(filter:any, value:any) {
    this.filters = filter+':"'+value+'"'
    console.log(this.filters)
    this.loading = true
    index.search(this.searchQuery,{hitsPerPage: this.hitsPerPage, filters: this.filters}).then(({ hits }) => {
      console.log(hits);
      this.pushHitsToMarkers(hits)
      this.loading = false
    });
  }
  clearFilters() {
    this.loading = true
    this.filters = ''
    index.search(this.searchQuery,{hitsPerPage: this.hitsPerPage}).then(({ hits }) => {
      console.log(hits);
      this.pushHitsToMarkers(hits)
      this.loading = false
    });
  }
  realTimeSearch() {
    this.loading = true
    if (this.filters === '') {
      index.search(this.searchQuery,{hitsPerPage: this.hitsPerPage}).then(({ hits }) => {
        // @ts-ignore
        this.hits = hits
        console.log(hits);
        this.pushHitsToMarkers(hits)
        this.loading = false
      });
    } else {
      index.search(this.searchQuery,{hitsPerPage: this.hitsPerPage, filters: this.filters}).then(({ hits }) => {
        // @ts-ignore
        this.hits = hits
        console.log(hits);
        this.pushHitsToMarkers(hits)
        this.loading = false
      });
    }
  }
  goToGeoloc() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords)
        this.zoom = 15
        this.center = (new L.LatLng(position.coords.latitude, position.coords.longitude))
      }
    );
  }
  goToMarker(marker:object) {
    this.zoom = 15
    // @ts-ignore
    this.center = (new L.LatLng(marker.fields.geo_point_2d[0], marker.fields.geo_point_2d[1]))
  }
}
