import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { ProductComponent } from './product/product.component';
import { SaleComponent } from './sale/sale.component';
import { NewSaleComponent } from './sale/new-sale/new-sale.component';
import { UsersComponent } from './users/users.component';
import { CustomerComponent } from './customer/customer.component';
import { CashRegisterComponent } from './cash-register/cash-register.component';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'homepage',
        component: HomepageComponent,
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'homepage',
        pathMatch: 'full'
      },
      {
        path: 'products',
        component: ProductComponent,
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },
      {
        path: 'sales',
        component: SaleComponent,
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'sales',
        pathMatch: 'full'
      },
      {
        path: 'new-sale',
        component: NewSaleComponent,
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'new-sale',
        pathMatch: 'full'
      },
      {
        path: 'users',
        component: UsersComponent,
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'customers',
        component: CustomerComponent,
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'customers',
        pathMatch: 'full'
      },
      {
        path: 'cash_register',
        component: CashRegisterComponent,
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'cash_register',
        pathMatch: 'full'
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
