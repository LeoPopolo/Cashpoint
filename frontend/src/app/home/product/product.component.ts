import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product.service';
import { DialogAddEditProductComponent } from '../dialogs/dialog-add-edit-product/dialog-add-edit-product.component';

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
    private dialogRef: MatDialogRef<DialogAddEditProductComponent>,
    private dialog: MatDialog,
    private productServices: ProductService
  ) { }

  async ngOnInit() {
    await this.getProducts();
  }

  async getProducts() {
    await this.productServices.getProducts().then(response => {
      this.productList = response.data;
    });
  }

  openDialogCreateProduct() {
    const dialogOptions = {
      width: '500px',
      data: {
        edit: false
      }
    }

    this.dialog.open(DialogAddEditProductComponent, dialogOptions);
  }
}
