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

  productFilter: string = '';

  productList: Array<Product> = [];

  filterData = {
    page: 0,
    name: null,
    brand: null,
    barcode: null
  }

  constructor(
    private productServices: ProductService,
    private saleServices: SaleService
  ) { }

  async ngOnInit() {
    await this.getProducts();

    const result = this.productList.filter(item => {
      return !item.name.includes('Jugo');
    });

    console.log(result);
  }

  async getProducts() {
    await this.productServices.getProducts(this.filterData)
    .then( response => {
      this.productList = response.products;
    })
    .catch( err => {
      console.log(err);
    });
  }
}
