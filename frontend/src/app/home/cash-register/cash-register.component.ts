import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogCloseCashRegisterComponent } from 'src/app/dialogs/dialog-close-cash-register/dialog-close-cash-register.component';
import { DialogOpenCashRegisterComponent } from '../../dialogs/dialog-open-cash-register/dialog-open-cash-register.component';
import { DialogSubstractCashComponent } from '../../dialogs/dialog-substract-cash/dialog-substract-cash.component';
import { CashRegisterService } from '../../services/cash_register.service';
var jsPDF = require('jspdf');
var autoTable = require('jspdf-autotable');
import * as fs from 'file-saver';
import { DialogSeeOutgoingsComponent } from 'src/app/dialogs/dialog-see-outgoings/dialog-see-outgoings.component';

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
  creation_timestamp: Date = new Date();
}

export class CashRegisterAnalytics {
  sales_quantity: number = 0;
  sold_items_quantity: number = 0;
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
  data_analytics: CashRegisterAnalytics = new CashRegisterAnalytics();
}

@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.component.html',
  styleUrls: ['./cash-register.component.scss']
})
export class CashRegisterComponent implements OnInit {

  cashRegistersList: Array<CashRegister> = [];
  cashRegister: CashRegister = new CashRegister();

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
    await this.getOpenCashRegister();
  }

  async identifyById(id: number) {
    await this.cashRegisterServices.identifyById(id)
    .then(resp => {
      this.cashRegister = resp.data;
    })
    .catch(err => console.log(err));
  }

  async isAnyOpen() {
    await this.cashRegisterServices.isAnyOpen()
    .then(resp => {
      this.isAnyCashRegisterOpen = resp.data;
    })
    .catch(err => console.log(err));
  }

  async getOpenCashRegister() {
    await this.cashRegisterServices.getOpenCashRegister()
    .then(resp => {
      this.cashRegister = resp.data;
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

  openDialogSeeOutgoings(outgoings: Array<CashRegisterMovements>) {
    const dialogOptions = {
      width: '350px',
      data: {
        outgoings: outgoings
      }
    }

    this.dialog.open(DialogSeeOutgoingsComponent, dialogOptions);
  }

  async openDialogCloseCashRegister() {
    const dialogOptions = {
      width: '500px',
      data: {
        cashRegister: this.cashRegister
      },
      disableClose: true
    }

    const dialogRef = this.dialog.open(DialogCloseCashRegisterComponent, dialogOptions);

    dialogRef.afterClosed().subscribe( async result => {

      if (result.close) {
        await this.closeCashRegister();
        await this.getCashRegisters();
        await this.identifyById(this.cashRegister.id);

        if (result.downloadPDF) {
          this.downloadReportPDF();
        }
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

  downloadReportPDF() {
    let namePdf = `Cierre de caja ${ new Date (this.cashRegister.closure_timestamp).toLocaleString('sv-SE')}`;
    const doc = new jsPDF.jsPDF();
    const col = ["Monto", "Descripción", "Fecha y hora"];
    const rows: any = [];

    doc.setFontSize(16);
    doc.text(`Cierre de caja: ${new Date (this.cashRegister.closure_timestamp).toLocaleString('sv-SE')}`, 13, 10);
    doc.setFontSize(10);
    doc.text("Fecha y hora de apertura: " + new Date(this.cashRegister.creation_timestamp).toLocaleString('sv-SE'), 13, 25);
    doc.text("Efectivo Inicial en caja: $" + this.cashRegister.initial_cash, 13, 30);
    doc.text("Ventas realizadas: " + this.cashRegister.data_analytics.sales_quantity, 13, 35);
    doc.text("Productos vendidos: " + this.cashRegister.data_analytics.sold_items_quantity, 13, 40);
    doc.setFontSize(14);
    doc.text("Ingresos parciales:", 13, 50);
    doc.setFontSize(10);
    doc.text("Efectivo: $" + this.cashRegister.partial_totals.total_cash, 13, 55);
    doc.text("Débito: $" + this.cashRegister.partial_totals.total_debit, 13, 60);
    doc.text("Crédito: $" + this.cashRegister.partial_totals.total_credit, 13, 65);
    doc.text("Mercadopago: $" + this.cashRegister.partial_totals.total_mp, 13, 70);
    doc.text("Transferencia: $" + this.cashRegister.partial_totals.total_transfer, 13, 75);
    doc.setFontSize(14);
    doc.text("Egresos de caja en efectivo:", 13, 85);
    doc.setFontSize(10);
    doc.text("Total en egresos: $" + this.parseOutgoings(this.cashRegister.outgoing_cash), 13, 90);
    doc.setFontSize(14);
    doc.text("Efectivo en caja", 13, 100);
    doc.setFontSize(10);
    doc.text("Total esperado en caja: $" + ((this.cashRegister.partial_totals.total_cash + this.cashRegister.initial_cash) - this.parseOutgoings(this.cashRegister.outgoing_cash)), 13, 105);
    doc.setFontSize(16);
    doc.text("Total facturado:", 13, 115);
    doc.setFontSize(12);
    doc.text("Total bruto: $" + this.cashRegister.total.total_gross, 13, 120);
    doc.setFontSize(14);
    doc.text("Total neto: $" + this.cashRegister.total.total_net, 13, 125);

    if (this.cashRegister.outgoing_cash.length > 0) {
      doc.setFontSize(14);
      doc.text("Detalle de egresos", 13, 135);

      const pageContent = function () {
        doc.setFontSize(16);
        doc.setTextColor(40);
      };
      const itemNew = this.cashRegister.outgoing_cash;

      itemNew.forEach(element => {

        const temp = [
          '$' + element.amount,
          element.description,
          new Date(element.creation_timestamp).toLocaleString('sv-SE')
        ];
        rows.push(temp);
      });
      doc.setFontSize(12);

      (doc as typeof autoTable & { autoTable: typeof autoTable }).autoTable({
        didDrawPage: pageContent,
        margin: { top: 140 },
        head: [col],
        body: rows,
        showHead: 'firstPage',
        headStyles: {
          halign: 'center',
          fillColor: [34, 47, 63]
        },
        columnStyles: {
          0: { cellWidth: 45, halign: 'left' },
          1: { cellWidth: 92, halign: 'left' },
          2: { cellWidth: 45, halign: 'left' }
        },
        styles: { overflow: 'hidden' },
        theme: 'grid',
      });
    }

    let finalY: number = (doc as any).lastAutoTable.finalY;

    finalY = finalY + 10;
    doc.save(`${namePdf}`);
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
