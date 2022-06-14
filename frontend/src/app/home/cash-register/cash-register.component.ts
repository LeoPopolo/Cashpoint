import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from '../../dialogs/dialog-confirm/dialog-confirm.component';
import { DialogOpenCashRegisterComponent } from '../../dialogs/dialog-open-cash-register/dialog-open-cash-register.component';
import { DialogSubstractCashComponent } from '../../dialogs/dialog-substract-cash/dialog-substract-cash.component';
import { CashRegisterService } from '../../services/cash_register.service';

export class CashRegisterTotals {
  total_cash: number = 0;
  total_debit: number = 0;
  total_credit: number = 0;
  total_mp: number = 0;
  total_transfer: number = 0;
}

export class CashRegisterTotal {
  total_gross: number = 0;
  total_net: number = 0;
}

export class CashRegisterMovements {
  amount: number = 0;
  description: string = '';
  user_owner_id: number = 0;
}

export class CashRegister {
  id: number = 0;
  creation_timestamp: Date = new Date();
  closed: boolean = false;
  partial_totals: CashRegisterTotals = new CashRegisterTotals();
  total: CashRegisterTotal = new CashRegisterTotal();
  outgoing_cash: Array<CashRegisterMovements> = [];
  closure_timestamp: Date = new Date();
  initial_cash: number = 0;
}

@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.component.html',
  styleUrls: ['./cash-register.component.scss']
})
export class CashRegisterComponent implements OnInit {

  cashRegistersList: Array<CashRegister> = [];

  filter: any = {
    page: 1,
    date_from: null,
    date_to: null
  }

  searchInfo: any = {
    totalPages: 0
  }

  isAnyCashRegisterOpen: boolean = false;

  constructor(
    private cashRegisterServices: CashRegisterService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    await this.getCashRegisters();
    await this.isAnyOpen();
  }

  async isAnyOpen() {
    await this.cashRegisterServices.isAnyOpen()
    .then(resp => {
      this.isAnyCashRegisterOpen = resp.data;
    })
    .catch(err => console.log(err));
  }

  async getCashRegisters() {
    await this.cashRegisterServices.getCashRegisters(this.filter)
    .then(response => {
      this.cashRegistersList = response.cash_registers;
      this.searchInfo.totalPages = response.total_pages;
    })
    .catch(err => console.log(err));
  }

  async closeCashRegister() {
    await this.cashRegisterServices.close()
    .then(() => {
      this.openSnackbar('Caja registradora cerrada con éxito');
    })
    .catch(err => console.log(err));
  }

  async substractCash(data: any) {
    await this.cashRegisterServices.substract(data)
    .then(()=> {
      this.openSnackbar('Egreso realizado con éxito');
    })
    .catch(err => console.log(err));
  }

  async openDialogSubstractCash() {
    if (!this.isAnyCashRegisterOpen) {
      this.openSnackbar('No hay una caja registradora abierta');
      return;
    }

    const dialogOptions = {
      width: '350px'
    }

    const dialogRef = this.dialog.open(DialogSubstractCashComponent, dialogOptions);

    dialogRef.afterClosed().subscribe( async result => {

      if (result) {
        await this.substractCash(result)
        .then(async ()=> {
          await this.getCashRegisters();
        });
      }
    });
  }

  async openDialogCloseCashRegister() {
    const dialogOptions = {
      width: '350px',
      data: {
        message: `¿Desea cerrar la caja de hoy?`
      }
    }

    const dialogRef = this.dialog.open(DialogConfirmComponent, dialogOptions);

    dialogRef.afterClosed().subscribe( async result => {

      if (result) {
        await this.closeCashRegister();
      }
    });
  }

  openDialogOpenCashRegister() {

    if (this.isAnyCashRegisterOpen) {
      this.openSnackbar('Ya hay una caja registradora abierta');
      return;
    }

    const dialogOptions = {
      width: '350px'
    }

    const dialogRef = this.dialog.open(DialogOpenCashRegisterComponent, dialogOptions);

    dialogRef.afterClosed().subscribe( async result => {

      if (result.open) {
        await this.openCashRegister(result.initialCash)
        .then(async ()=> {
          await this.getCashRegisters();
        });
      }
    });
  }

  async openCashRegister(amount: number) {
    const data = {
      initial_cash: amount
    };

    await this.cashRegisterServices.createCashRegister(data)
    .then(()=> {
      this.openSnackbar('Caja abierta con éxito');
    })
    .catch(err =>{
      console.log(err);
      this.openSnackbar('Se produjo un error al intentar abrir la caja. Reintente más tarde');
    });
  }

  parseOutgoings(items: Array<CashRegisterMovements>): number {
    let response = 0;

    items.forEach(element => {
      response += element.amount;
    });

    return response;
  }

  openSnackbar(message: string) {
    this.snackbar.open(message, 'OK', {
      duration: 3000,
      panelClass: 'snack-bar-style'
    });
  }

  async nextPage() {

    if (this.filter.page < this.searchInfo.totalPages) {
      this.filter.page --;
      await this.getCashRegisters();
    }

  }

  async previousPage() {

    if (this.filter.page > 1) {
      this.filter.page --;
      await this.getCashRegisters();
    }
  }
}
