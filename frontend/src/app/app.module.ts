import { LOCALE_ID, NgModule } from '@angular/core';
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
import { CommonModule, registerLocaleData } from '@angular/common';
import { HomeModule } from './home/home.module';
import { DialogAddEditProductComponent } from './dialogs/dialog-add-edit-product/dialog-add-edit-product.component';
import { DialogConfirmComponent } from './dialogs/dialog-confirm/dialog-confirm.component';
import localeEsAr from '@angular/common/locales/es-AR';
import { DialogSeeSaleComponent } from './dialogs/dialog-see-sale/dialog-see-sale.component';
import { DialogCloseSaleComponent } from './dialogs/dialog-close-sale/dialog-close-sale.component';
import { DialogAddEditUserComponent } from './dialogs/dialog-add-edit-user/dialog-add-edit-user.component';

registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DialogAddEditProductComponent,
    DialogConfirmComponent,
    DialogSeeSaleComponent,
    DialogCloseSaleComponent,
    DialogAddEditUserComponent
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
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-Ar' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
