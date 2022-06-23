import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductResponse, ProductRequest, Brand } from '../../home/product/product.component';
import { ProductService } from '../../services/product.service';
import { DialogAddBrandComponent } from '../dialog-add-brand/dialog-add-brand.component';

@Component({
  selector: 'app-dialog-add-edit-product',
  templateUrl: './dialog-add-edit-product.component.html',
  styleUrls: ['./dialog-add-edit-product.component.scss']
})
export class DialogAddEditProductComponent implements OnInit {

  addProductForm: FormGroup = this.createForm();
  editBool: boolean = false;

  oldProduct: ProductResponse = new ProductResponse();
  brandList: Array<Brand> = [];

  showFilteredBrandList: boolean = false;
  filteredBrandList: Array<Brand> = [];
  brandFilter: string = '';
  selectedBrand: Brand = new Brand();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogAddEditProductComponent>,
    private productServices: ProductService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  async ngOnInit() {
    if (this.data.edit) {
      this.editBool = true;

      this.loadOldProduct(this.data.id);
    }

    await this.getBrands();
  }

  async getBrands() {
    await this.productServices.getBrands()
    .then(response => {
      this.brandList = response.data.brands;
    })
    .catch(err => console.log(err));
  }

  async loadOldProduct(id: number) {
    await this.identifyById(id).then(()=>{
      this.addProductForm.setValue(
        {
          name: this.oldProduct.name,
          description: this.oldProduct.description,
          stock: this.oldProduct.stock,
          price: this.oldProduct.price,
          barcode: this.oldProduct.barcode
        }
      );

      this.brandFilter = this.oldProduct.brand.name;
      this.selectedBrand = this.oldProduct.brand;
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

      if (this.selectedBrand.id !== this.oldProduct.brand.id &&
        this.selectedBrand.id !== 0 && this.selectedBrand)
        await this.setBrand(this.selectedBrand.id!).then(() => changes = true);

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

  async setBrand(brand_id: number) {
    await this.productServices.setBrand(this.data.id, brand_id).catch(err => console.log(err));
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
      barcode: ['', Validators.required],
    });

    return form;
  }

  async validateForm() {

    if (this.addProductForm.valid && this.selectedBrand) {
      const productData: ProductRequest = {
        name: this.addProductForm.value.name,
        description: this.addProductForm.value.description,
        price: this.addProductForm.value.price,
        stock: this.addProductForm.value.stock,
        brand_id: this.selectedBrand.id!,
        barcode: this.addProductForm.value.barcode,
      }

      await this.createProduct(productData);
    }
  }

  async createProduct(data: ProductRequest) {
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

  closeFilteredProducts() {
    this.showFilteredBrandList = false;
  }

  selectBrand(item: Brand) {
    this.selectedBrand = item;
    this.brandFilter = item.name;
    this.closeFilteredProducts();
  }

  filterAllData() {
    this.showFilteredBrandList = true;

    this.filteredBrandList = this.brandList.filter(item => {
      return item.name.toLowerCase().includes(this.brandFilter.toLowerCase());
    });
  }

  addBrand() {
    const dialogOptions = {
      width: '350px',
    }

    const dialogRef = this.dialog.open(DialogAddBrandComponent, dialogOptions);

    dialogRef.afterClosed().subscribe( result => {

      if (result) {
        this.selectBrand(result);
      } else {
        this.openSnackbar('Se produjo un error al intentar agregar la marca');
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
