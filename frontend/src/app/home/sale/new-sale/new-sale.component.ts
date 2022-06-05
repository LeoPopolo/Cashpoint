import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import { Product } from '../../product/product.component';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss']
})
export class NewSaleComponent implements OnInit {

  productFilterAll: string = '';

  productList: Array<Product> = [];

  filteredProductList: Array<Product> = []

  filterData = {
    page: 0,
    name: null,
    brand: null,
    barcode: null
  }

  showFilteredProductList: boolean = false;

  saleProducts: Array<Product> = [];

  constructor(
    private productServices: ProductService,
    private saleServices: SaleService
  ) { }

  async ngOnInit() {
    await this.getProducts();
  }

  filterAllData() {
    this.showFilteredProductList = true;

    this.filteredProductList = this.productList.filter(item => {
      return item.name.toLowerCase().includes(this.productFilterAll.toLowerCase())
          || item.brand.toLowerCase().includes(this.productFilterAll.toLowerCase())
          || item.barcode.toLowerCase().includes(this.productFilterAll.toLowerCase())
          || item.description.toLowerCase().includes(this.productFilterAll.toLowerCase());
    });
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

  addToSale(item: Product) {
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
  }

  closeFilteredProducts() {
    this.showFilteredProductList = false;
    this.productFilterAll = '';
  }

}
