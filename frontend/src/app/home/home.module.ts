import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { SaleComponent } from './sale/sale.component';
import { MaterialModule } from '../shared/material.module';
import { DialogAddEditProductComponent } from './dialogs/dialog-add-edit-product/dialog-add-edit-product.component';

const PAGES_COMPONENTS = [
  SidebarComponent,
  HomeComponent,
  SaleComponent
];

@NgModule({
  imports: [
    HomeRoutingModule,
    CommonModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    DialogAddEditProductComponent
  ],
})
export class HomeModule {
}
