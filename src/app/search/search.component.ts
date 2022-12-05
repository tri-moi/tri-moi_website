import { Component, OnInit } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';
import { environment } from '../../environments/environment'

const searchClient = algoliasearch(
  environment.algolia_id,
  environment.algolia_key
);
const index = searchClient.initIndex('pav');
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor() { }

  config = {
    indexName: 'pav',
    searchClient
  };

  ngOnInit(): void {
    index.search('').then(({ hits }) => {
      console.log(hits);
    });
  }

}
