import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './blank/blank.component';
import { MapComponent } from './map/map.component';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'branding',
    component: BlankComponent
  },
  {
    path: 'accueil',
    component: HomeComponent
  },
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'search',
    component: SearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
