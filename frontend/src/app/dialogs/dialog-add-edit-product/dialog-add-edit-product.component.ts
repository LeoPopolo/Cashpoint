import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../home/product/product.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dialog-add-edit-product',
  templateUrl: './dialog-add-edit-product.component.html',
  styleUrls: ['./dialog-add-edit-product.component.scss']
})
export class DialogAddEditProductComponent implements OnInit {

  addProductForm: FormGroup = this.createForm();
  editBool: boolean = false;

  oldProduct: Product = new Product();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogAddEditProductComponent>,
    private productServices: ProductService,
    private formBuilder: FormBuilder
  ) { }

  async ngOnInit() {
    if (this.data.edit) {
      this.editBool = true;

      this.loadOldProduct(this.data.id);
    }
  }

  async loadOldProduct(id: number) {
    await this.identifyById(id).then(()=>{
      this.addProductForm.setValue(
        {
          name: this.oldProduct.name,
          description: this.oldProduct.description,
          stock: this.oldProduct.stock,
          price: this.oldProduct.price,
          brand: this.oldProduct.brand,
          barcode: this.oldProduct.barcode
        }
      );
    });
  }

  async saveChanges() {
    let changes: boolean = false;

    if (this.addProductForm.valid) {
      if (this.addProductForm.value.name !== this.oldProduct.name)
        await this.setName(this.addProductForm.value.name).then(() => changes = true);

      if (this.addProductForm.value.description !== this.oldProduct.description)
        await this.setDescription(this.addProductForm.value.description).then(() => changes = true);

      if (this.addProductForm.value.price !== this.oldProduct.price)
        await this.setPrice(this.addProductForm.value.price).then(() => changes = true);

      if (this.addProductForm.value.stock !== this.oldProduct.stock)
        await this.setStock(this.addProductForm.value.stock).then(() => changes = true);

      if (this.addProductForm.value.brand !== this.oldProduct.brand)
        await this.setBrand(this.addProductForm.value.brand).then(() => changes = true);

      if (this.addProductForm.value.barcode !== this.oldProduct.barcode)
        await this.setBarcode(this.addProductForm.value.barcode).then(() => changes = true);
    }

    if (changes) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(false);
    }
  }

  async setName(name: string) {
    await this.productServices.setName(this.data.id, name).catch(err => console.log(err));
  }

  async setDescription(description: string) {
    await this.productServices.setDescription(this.data.id, description).catch(err => console.log(err));
  }

  async setPrice(price: number) {
    await this.productServices.setPrice(this.data.id, price).catch(err => console.log(err));
  }

  async setStock(stock: number) {
    await this.productServices.setStock(this.data.id, stock).catch(err => console.log(err));
  }

  async setBrand(brand: string) {
    await this.productServices.setBrand(this.data.id, brand).catch(err => console.log(err));
  }

  async setBarcode(barcode: string) {
    await this.productServices.setBarcode(this.data.id, barcode).catch(err => console.log(err));
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      stock: ['', Validators.required],
      price: ['', Validators.required],
      brand: ['', Validators.required],
      barcode: ['', Validators.required],
    });

    return form;
  }

  async validateForm() {

    if (this.addProductForm.valid) {
      const productData: Product = {
        name: this.addProductForm.value.name,
        description: this.addProductForm.value.description,
        price: this.addProductForm.value.price,
        stock: this.addProductForm.value.stock,
        brand: this.addProductForm.value.brand,
        barcode: this.addProductForm.value.barcode,
      }

      await this.createProduct(productData);
    }
  }

  async createProduct(data: Product) {
    await this.productServices.createProduct(data).then(()=>{
      this.dialogRef.close(true);
    })
    .catch(err => {
      this.dialogRef.close(false);
      console.log(err);
    });
  }

  async identifyById(id: number) {
    await this.productServices.identifyById(id).then(response=>{
      this.oldProduct = response.data;
    })
    .catch(err => {
      console.log(err);
    });
  }
}
