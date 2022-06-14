import { Component, OnInit } from '@angular/core';
import { CashRegisterService } from 'src/app/services/cash_register.service';
import { CashRegister, CashRegisterMovements } from '../cash-register/cash-register.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  openCashRegister: CashRegister = new CashRegister();

  constructor(
    private cashRegisterServices: CashRegisterService
  ) { }

  async ngOnInit() {
    await this.getOpenCashRegister();
  }

  async getOpenCashRegister() {
    await this.cashRegisterServices.getOpenCashRegister()
    .then(response => {
      this.openCashRegister = response.data;
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
}
