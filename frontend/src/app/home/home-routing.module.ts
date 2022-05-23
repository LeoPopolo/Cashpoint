import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { ProductComponent } from './product/product.component';
import { SaleComponent } from './sale/sale.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'products',
        component: ProductComponent,
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
      {
        path: 'sales',
        component: SaleComponent,
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'sales',
        pathMatch: 'full',
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {
}
