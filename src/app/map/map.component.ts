import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import algoliasearch from 'algoliasearch/lite';
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

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 49.443232, 1.099971 ],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
    index.search('',{hitsPerPage: 50,}).then(({ hits }) => {
      console.log(hits);
      hits.forEach(hit => {
        // @ts-ignore
        let marker = L.marker([hit.fields.geo_point_2d[0], hit.fields.geo_point_2d[1]]).addTo(this.map);
      })
    });
  }
}
