import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './shared/material.module';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { DialogAddEditProductComponent } from './dialogs/dialog-add-edit-product/dialog-add-edit-product.component';
import { DialogConfirmComponent } from './dialogs/dialog-confirm/dialog-confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DialogAddEditProductComponent,
    DialogConfirmComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule,
    HomeModule
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
