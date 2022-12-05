import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import algoliasearch from 'algoliasearch/lite';
import * as L from 'leaflet';
import { environment } from '../../environments/environment'
import { ActivatedRoute } from '@angular/router';

let searchClient:any = algoliasearch(
  environment.algolia_id,
  environment.algolia_key
);
let index = searchClient.initIndex('pav');
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map:any;
  @ViewChild('myInput') myInput: any;
  constructor(private route: ActivatedRoute) { }
  geoLocDenied = false
  loading = true
  hitsPerPage = 1000
  searchQuery = ''
  filters = ''
  urlFilter:string
  hits:any = []
  center = L.latLng( 49.443232, 1.099971 )
  zoom = 12
  options = {
    attributionControl: false,
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, minZoom : 8 }),
    ],
  };
  layers = [
    L.marker([ 0, 10 ])
  ]
  layerGroup= L.markerClusterGroup()
  userLayer = [L.marker([ 0, 0 ])]
  ngAfterViewInit(): void {
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
    this.route.queryParamMap
      .subscribe((params:any) => {
        console.log(params.params.filter)
        this.urlFilter = params.params.filter
      })
    if (this.urlFilter && (this.urlFilter === 'Textile' || this.urlFilter === 'Emballages recyclables' || this.urlFilter === 'Emballages en verre' || this.urlFilter === 'Ordures ménagères')) {
      this.addToFilters('fields.pavtyp', this.urlFilter)
    } else {
      this.searchMultiple([
        {
          indexName:'pav',
          query: this.searchQuery,
          params: {hitsPerPage: this.hitsPerPage}
        },
        {
          indexName:'pav',
          query: this.searchQuery,
          params: {hitsPerPage: this.hitsPerPage, page: 1}
        },
        {
          indexName:'pav',
          query: this.searchQuery,
          params: {hitsPerPage: this.hitsPerPage, page: 2}
        }
      ])
    }
    this.goToGeoloc()
    console.log(this.userLayer)
  }
  searchMultiple(queries:any) {
    searchClient.multipleQueries(queries).then((results:any) => {
      let hits = results.results[0].hits.concat(results.results[1].hits).concat(results.results[2].hits)
      this.loading = false
      this.pushHitsToMarkers(hits)
      this.hits=hits.slice(0,20)
    })
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
        }).bindPopup("<p>"+hit.fields.pavtyp+"<br><b>"+hit.fields.adresse+"</b></p>").openPopup()
          .on('click', event => {
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
    this.searchMultiple([{
        indexName:'pav',
        query: this.searchQuery,
        params: {hitsPerPage: this.hitsPerPage,filters: this.filters}
      },
      {
        indexName:'pav',
        query: this.searchQuery,
        params: {hitsPerPage: this.hitsPerPage, page: 1,filters: this.filters}
      },
      {
        indexName:'pav',
        query: this.searchQuery,
        params: {hitsPerPage: this.hitsPerPage, page: 2,filters: this.filters}
      }])
  }
  clearFilters() {
    this.loading = true
    this.filters = ''
    this.searchMultiple([{
      indexName:'pav',
      query: this.searchQuery,
      params: {hitsPerPage: this.hitsPerPage}
    },
      {
        indexName:'pav',
        query: this.searchQuery,
        params: {hitsPerPage: this.hitsPerPage, page: 1}
      },
      {
        indexName:'pav',
        query: this.searchQuery,
        params: {hitsPerPage: this.hitsPerPage, page: 2}
      }])
  }
  realTimeSearch() {
    if (this.filters === '') {
      this.searchMultiple([{
        indexName:'pav',
        query: this.searchQuery,
        params: {hitsPerPage: this.hitsPerPage}
      },
        {
          indexName:'pav',
          query: this.searchQuery,
          params: {hitsPerPage: this.hitsPerPage, page: 1}
        },
        {
          indexName:'pav',
          query: this.searchQuery,
          params: {hitsPerPage: this.hitsPerPage, page: 2}
        }])
    } else {
      this.searchMultiple([{
        indexName:'pav',
        query: this.searchQuery,
        params: {hitsPerPage: this.hitsPerPage,filters: this.filters}
      },
        {
          indexName:'pav',
          query: this.searchQuery,
          params: {hitsPerPage: this.hitsPerPage, page: 1,filters: this.filters}
        },
        {
          indexName:'pav',
          query: this.searchQuery,
          params: {hitsPerPage: this.hitsPerPage, page: 2,filters: this.filters}
        }])
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
