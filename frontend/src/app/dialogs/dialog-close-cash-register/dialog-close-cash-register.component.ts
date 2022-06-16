import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CashRegister, CashRegisterMovements } from '../../home/cash-register/cash-register.component';

@Component({
  selector: 'app-dialog-close-cash-register',
  templateUrl: './dialog-close-cash-register.component.html',
  styleUrls: ['./dialog-close-cash-register.component.scss']
})
export class DialogCloseCashRegisterComponent implements OnInit {

  cashRegister: CashRegister = new CashRegister();
  checkboxColor: ThemePalette;

  public responseData: any = {
    close: true,
    downloadPDF: false
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogCloseCashRegisterComponent>
  ) { }

  ngOnInit() {
    this.cashRegister = this.data.cashRegister;
    this.checkboxColor = 'primary';

    if (this.cashRegister.data_analytics.sales_quantity === 0 &&
        this.cashRegister.outgoing_cash.length > 0) {

        this.cashRegister = new CashRegister();
    }
  }

  parseOutgoings(items: Array<CashRegisterMovements>): number {
    let response = 0;

    items.forEach(element => {
      response += element.amount;
    });

    return response;
  }

  closeCashRegister(close: boolean) {
    this.responseData.close = close;

    this.dialogRef.close(this.responseData);
  }
}
