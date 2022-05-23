import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';

const PAGES_COMPONENTS = [
  SidebarComponent,
  HomeComponent
];

@NgModule({
  imports: [
    HomeRoutingModule,
    CommonModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class HomeModule {
}
