import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './blank/blank.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import {ProfilComponent} from "./profil/profil.component";
import {HistoriqueComponent} from "./historique/historique.component";
import {BadgeComponent} from "./badge/badge.component";
import {ProduitComponent} from "./produit/produit.component";

const routes: Routes = [
  {
    path: 'branding',
    component: BlankComponent
  },
  {
    path: 'connexion',
    component: LoginComponent
  },
  {
    path: 'inscription',
    component: RegisterComponent
  },
  {
    path: '',
    component: MapComponent
  },
  {
    path: 'map',
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
    path: 'produit',
    component: ProduitComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
