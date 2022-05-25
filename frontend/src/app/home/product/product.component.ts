import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { ProductService } from 'src/app/services/product.service';
import { DialogAddEditProductComponent } from '../../dialogs/dialog-add-edit-product/dialog-add-edit-product.component';

export class Product {
  id?: number = 0;
  name: string = '';
  description: string = '';
  price: number = 0;
  stock: number = 0;
  barcode: string = '';
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  productList: Array<Product> = [];

  constructor(
    private dialog: MatDialog,
    private productServices: ProductService,
    private snackbar: MatSnackBar
  ) { }

  async ngOnInit() {
    await this.getProducts();
  }

  async getProducts() {
    await this.productServices.getProducts().then(response => {
      this.productList = response.data;
    });
  }

  async deleteProduct(id: number) {
    await this.productServices.deleteProduct(id).then(async () => {
      this.openSnackbar('Producto eliminado con éxito');
      await this.getProducts();
    });
  }

  openDialogCreateEditProduct(action: string, id?: number) {
    const dialogOptions = {
      width: '350px',
      data: {
        edit: action === 'edit' ? true : false,
        id: id
      }
    }

    const dialogRef = this.dialog.open(DialogAddEditProductComponent, dialogOptions);

    dialogRef.afterClosed().subscribe( async result => {

      if (result) {
        if (action === 'edit') {
          this.openSnackbar("Producto modificado con éxito");
        } else if (action === 'create') {
          this.openSnackbar("Producto agregado con éxito");
        }
      } else if (result === false) {
        if (action === 'create') {
          this.openSnackbar("Error al intentar agregar el producto");
        }
      }

      await this.getProducts();
    });
  }

  async openDialogDelete(id: number | any, name: string) {
    const dialogOptions = {
      width: '350px',
      data: {
        message: `¿Desea eliminar el producto ${name}?`
      }
    }

    const dialogRef = this.dialog.open(DialogConfirmComponent, dialogOptions);

    dialogRef.afterClosed().subscribe( async result => {

      if (result) {
        await this.deleteProduct(id);
      }
    });
  }

  openSnackbar(message: string) {
    this.snackbar.open(message, 'OK', {
      duration: 3000,
      panelClass: 'snack-bar-style'
    });
  }
}
