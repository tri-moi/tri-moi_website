import { Component, AfterViewInit, ViewChild } from '@angular/core';
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
  @ViewChild('myInput') myInput: any;
  constructor() { }
  geoLocDenied = false
  loading = true
  hitsPerPage = 5000
  searchQuery = ''
  filters = ''
  hits:any = []
  center = L.latLng( 49.443232, 1.099971 )
  zoom = 12
  options = {
    attributionControl: false,
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }),
    ],
  };
  layers = [
    L.marker([ 0, 10 ])
  ]
  layerGroup= L.markerClusterGroup()
  userLayer = [L.marker([ 0, 0 ])]
  ngAfterViewInit(): void {
    index.search(this.searchQuery,{hitsPerPage: this.hitsPerPage,}).then(({ hits }) => {
      console.log(hits);
      this.pushHitsToMarkers(hits)
      this.loading = false
    });
    this.goToGeoloc()
    console.log(this.userLayer)
  }
  pushHitsToMarkers(hits:any) {
    // let markers: L.Marker<any>[]=[]
    let markersCluster=L.markerClusterGroup()
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
        markersCluster.addLayer(L.marker([ hit.fields.geo_point_2d[0], hit.fields.geo_point_2d[1] ], {
          icon: L.icon({
            iconUrl: icon,
            iconSize: [34, 40 ],
            iconAnchor:   [17, 42],
          })
        }).bindPopup("<p>"+hit.fields.pavtyp+"<br><b>"+hit.fields.adresse+"</b></p>").openPopup().on('click', event => {
          this.searchQuery = hit['fields']['adresse']+', '+hit['fields']['commune']
          this.realTimeSearch()
          this.myInput.nativeElement.value=hit['fields']['adresse']+', '+hit['fields']['commune']
        }))
    })
    // this.layers = markers
    console.log(markersCluster)
    this.layerGroup = markersCluster

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
    if (this.filters === '') {
      index.search(this.searchQuery,{hitsPerPage: this.hitsPerPage}).then(({ hits }) => {
        this.hits = hits
        this.pushHitsToMarkers(hits)
      });
    } else {
      index.search(this.searchQuery,{hitsPerPage: this.hitsPerPage, filters: this.filters}).then(({ hits }) => {
        this.hits = hits
        console.log(hits);
        this.pushHitsToMarkers(hits)
      });
    }
  }
  goToGeoloc() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let marker: L.Marker<any>[]=[]
        this.zoom = 16
        this.center = (new L.LatLng(position.coords.latitude, position.coords.longitude))
        marker.push(L.marker([position.coords.latitude, position.coords.longitude],{
          icon: L.icon({
            iconUrl: './assets/images/icons8-standing-man-100.png',
            iconSize: [42, 50 ],
            iconAnchor:   [21, 50],
          })
        }))
        this.userLayer = marker
      }, (error) => {
        alert(error.message)
        this.geoLocDenied = true
      }
    );
  }
  goToMarker(marker:any,name:string = '') {
    this.zoom = 15
    console.log('marker',marker)
    this.center = (new L.LatLng(marker.fields.geo_point_2d[0], marker.fields.geo_point_2d[1]))
    if (name !== '') {
      this.myInput.nativeElement.value =name
      this.searchQuery = name
      this.realTimeSearch()
    }
  }
}
