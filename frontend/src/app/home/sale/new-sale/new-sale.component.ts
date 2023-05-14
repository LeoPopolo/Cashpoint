import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogCloseSaleComponent } from 'src/app/dialogs/dialog-close-sale/dialog-close-sale.component';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm/dialog-confirm.component';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import { ProductRequest, ProductResponse } from '../../product/product.component';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss']
})
export class NewSaleComponent implements OnInit, AfterViewInit {

  userData: any;

  productFilterAll: string = '';
  productFilterBarcode: string = '';

  productList: Array<ProductResponse> = [];

  filteredProductList: Array<ProductResponse> = [];

  filterData = {
    page: 0,
    name: null,
    brand: null,
    barcode: null
  };

  showFilteredProductList: boolean = false;

  saleProducts: Array<ProductResponse> = [];

  subtotal: number = 0;
  total: number = 0;
  discount: number = 0;
  payment_method: string = '';
  customer_id: number = 1;

  @ViewChild("barcode") inputBarcode!: ElementRef;

  constructor(
    private productServices: ProductService,
    private saleServices: SaleService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) { }

  async ngOnInit() {

    await this.getProducts();

    this.userData = JSON.parse(localStorage.getItem('userData')!);
  }

  ngAfterViewInit(): void {
    this.inputBarcode.nativeElement.focus();
  }

  filterAllData() {
    this.showFilteredProductList = true;

    this.filteredProductList = this.productList.filter(item => {
      return item.name.toLowerCase().includes(this.productFilterAll.toLowerCase())
          || item.brand.name.toLowerCase().includes(this.productFilterAll.toLowerCase())
          || item.barcode.toLowerCase().includes(this.productFilterAll.toLowerCase())
          || item.description.toLowerCase().includes(this.productFilterAll.toLowerCase());
    });
  }

  updateTotal() {
    let total = 0;

    for (let item of this.saleProducts) {
      total += item.price * item.quantity!;
    }

    this.subtotal = total;
    this.total = this.subtotal;

    if (this.discount > 0) {
      this.total = (this.total - (this.total * this.discount / 100));
    }
  }

  backToSales() {
    const dialogOptions = {
      width: '350px',
      data: {
        message: `¿Desea volver? La venta se eliminará.`
      },
    }

    const dialogRef = this.dialog.open(DialogConfirmComponent, dialogOptions);

    dialogRef.afterClosed().subscribe( result => {

      if (result) {
        this.router.navigate(['sales']);
      }
    });
  }

  removeFromSale(id: number) {
    const result = this.saleProducts.findIndex(element => element.id === id);

    this.saleProducts.splice(result, 1);

    this.updateTotal();
  }

  async getProducts() {
    await this.productServices.getProducts(this.filterData)
    .then( response => {
      this.productList = response.products;
      this.filteredProductList = this.productList;
    })
    .catch( err => {
      console.log(err);
    });
  }

  async identifyByBarcode() {
    await this.productServices.identifyByBarcode(this.productFilterBarcode)
    .then( response => {
      this.addToSale(response.data);
    })
    .catch( err => {
      console.log(err);

      if (err.error.error === 'No data found') {
        this.openSnackbar('Producto no encontrado');
      }
    });

    this.productFilterBarcode = '';
  }

  async openDialogCloseSale() {
    const dialogOptions = {
      width: '350px'
    }

    if (this.saleProducts.length > 0) {
      const dialogRef = this.dialog.open(DialogCloseSaleComponent, dialogOptions);

      dialogRef.afterClosed().subscribe( async result => {

        if (result.close) {
          this.payment_method = result.payment_method;
          this.customer_id = result.customer_id;

          await this.closeSale();
        }
      });
    } else {
      this.openSnackbar('No hay productos cargados en la venta');
    }
  }

  async closeSale() {

    const body = {
      user_owner_id: this.userData.id,
      payment_method: this.payment_method,
      discount: this.discount,
      products: this.saleProducts,
      customer_id: this.customer_id
    };

    await this.saleServices.createSale(body)
    .then(() => {

      this.router.navigate(['sales']);
      this.openSnackbar('Venta registrada con éxito');
    })
    .catch(err => {
      console.log(err);
    });
  }

  addToSale(item: ProductResponse) {
    this.showFilteredProductList = false;
    this.productFilterAll = '';

    const result = this.saleProducts.findIndex(element => element.id === item.id);

    if (result >= 0) {

      if (this.saleProducts[result].quantity) {
        this.saleProducts[result].quantity! += 1;
      }

    } else {

      if (item.quantity)
        item.quantity += 1;
      else
        item.quantity = 1;

      this.saleProducts.push(item);
    }

    this.updateTotal();
  }

  closeFilteredProducts() {
    this.showFilteredProductList = false;
    this.productFilterAll = '';
  }

  openSnackbar(message: string) {
    this.snackbar.open(message, 'OK', {
      duration: 3000,
      panelClass: 'snack-bar-style'
    });
  }

}
