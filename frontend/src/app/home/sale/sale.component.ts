import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogSeeSaleComponent } from 'src/app/dialogs/dialog-see-sale/dialog-see-sale.component';
import { SaleService } from '../../services/sale.service';
import { Product } from '../product/product.component';

export class SaleResponse {
  id: number = 0;
  total: number = 0;
  status: string = '';
  payment_method: string = '';
  products: Array<Product> = [];
  creation_timestamp: Date = new Date();
  discount: number = 0;
  user_owner_id: number = 0;
}

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {

  jsonFilter: any = {
    page: 1,
    total: null,
    payment_method: null,
    date_from: null,
    date_to: null
  };

  filterOpened: boolean = false;

  saleList: Array<SaleResponse> = [];

  searchInfo: any = {
    totalPages: 0
  }

  constructor(
    private dialog: MatDialog,
    private saleServices: SaleService
  ) { }

  async ngOnInit() {
    await this.getSales();
  }

  async getSales() {
    await this.saleServices.getSales(this.jsonFilter)
    .then(response => {
      this.saleList = response.sales;
      this.searchInfo.totalPages = response.total_pages;
    })
    .catch(err => {
      console.log(err);
    });
  }

  parseStatus(status: string): string {
    switch(status) {
      case 'closed':
        return 'cerrada';
      case 'cancelled':
        return 'cancelada';
      default:
        return '--';
    }
  }

  openDialogSeeSale(id: number) {
    const dialogOptions = {
      width: '1024px',
      data: {
        id: id
      }
    }

    this.dialog.open(DialogSeeSaleComponent, dialogOptions);
  }

  async executeFilters() {

  }

  async previousPage() {

  }

  async nextPage() {

  }

}
