import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { SaleComponent } from './sale/sale.component';
import { ProductComponent } from './product/product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    SidebarComponent,
    SaleComponent,
    ProductComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    MaterialModule
  ],
  providers: []
})
export class HomeModule {
}