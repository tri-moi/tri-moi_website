import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BlankComponent} from './blank/blank.component';
import {RegisterComponent} from './register/register.component';
import {MapComponent} from './map/map.component';
import {SearchComponent} from './search/search.component';
import {ProfilComponent} from "./profil/profil.component";
import {HistoriqueComponent} from "./historique/historique.component";
import {BadgeComponent} from "./badge/badge.component";
import {ScannerComponent} from './scanner/scanner.component';
import {ProductSheetComponent} from './product-sheet/product-sheet.component';
import {ParametreComponent} from "./parametre/parametre.component";

const routes: Routes = [
  {
    path: 'branding',
    component: BlankComponent
  },
  {
    path: 'auth',
    component: RegisterComponent
  },
  {
    path: '',
    component: MapComponent
  },
  {
    path: 'profil',
    component: ProfilComponent
  },
  {
    path: 'historique',
    component: HistoriqueComponent
  },
  {
    path: 'badge',
    component: BadgeComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'scanner',
    component: ScannerComponent
  },
  {
    path: 'product/:barcode',
    component: ProductSheetComponent
  },
  {
    path: 'parametres',
    component: ParametreComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
