import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './blank/blank.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MapComponent } from './map/map.component';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';
import { ScannerComponent } from './scanner/scanner.component';
import { ProductSheetComponent } from './product-sheet/product-sheet.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
