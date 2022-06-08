import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SaleResponse } from '../../home/sale/sale.component';
import { SaleService } from '../../services/sale.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-dialog-see-sale',
  templateUrl: './dialog-see-sale.component.html',
  styleUrls: ['./dialog-see-sale.component.scss']
})
export class DialogSeeSaleComponent implements OnInit {

  sale: SaleResponse = new SaleResponse();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogConfirmComponent>,
    private saleServices: SaleService
  ) { }

  async ngOnInit() {
    await this.identifyById();

    console.log(this.sale);
  }

  async identifyById() {
    await this.saleServices.identifyById(this.data.id)
    .then(response => {
      this.sale = response.data;
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

  calcSubtotal() {
    let subtotal = 0;

    for (let item of this.sale.products) {

      if (!item.quantity)
        item.quantity = 0;

      subtotal += item.quantity * item.price;
    }

    return subtotal;
  }
}
