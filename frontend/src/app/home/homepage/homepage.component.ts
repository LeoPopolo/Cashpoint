import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CashRegisterService } from '../../services/cash_register.service';
import { SaleService } from '../../services/sale.service';
import { CashRegister, CashRegisterMovements } from '../cash-register/cash-register.component';
import { SaleResponse } from '../sale/sale.component';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DialogSeeSaleComponent } from '../../dialogs/dialog-see-sale/dialog-see-sale.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  openCashRegister: CashRegister = new CashRegister();
  isAnyOpen: boolean = false;

  saleFilter: any = {
    page: 0,
    total: null,
    payment_method: 'todos',
    date_from: moment().format('YYYY-MM-DD'),
    date_to: moment().format('YYYY-MM-DD')
  };

  salesList: Array<SaleResponse> = [];
  outgoingsList: Array<CashRegisterMovements> = [];

  constructor(
    private cashRegisterServices: CashRegisterService,
    private saleServices: SaleService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    await this.getOpenCashRegister();
    await this.getSales();
  }

  async getOpenCashRegister() {
    await this.cashRegisterServices.getOpenCashRegister()
    .then(response => {
      if (!response.data) {
        this.isAnyOpen = false;
      } else {
        this.openCashRegister = response.data;
        this.outgoingsList = response.data.outgoing_cash;
        this.saleFilter.date_from = new Date(this.openCashRegister.creation_timestamp).toLocaleString('sv-SE');
        this.isAnyOpen = true;
      }
    })
    .catch(err => console.log(err));
  }

  async getSales() {
    await this.saleServices.getSales(this.saleFilter)
    .then(response => {
      this.salesList = response.sales;
    })
    .catch(err => console.log(err));
  }

  parseOutgoings(items: Array<CashRegisterMovements>): number {
    let response = 0;

    items.forEach(element => {
      response += element.amount;
    });

    return response;
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

  goToCashRegisters() {
    this.router.navigate(['cash_register']);
  }
}
