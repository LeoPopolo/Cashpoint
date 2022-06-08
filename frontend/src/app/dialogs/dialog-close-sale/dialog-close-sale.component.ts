import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-close-sale',
  templateUrl: './dialog-close-sale.component.html',
  styleUrls: ['./dialog-close-sale.component.scss']
})
export class DialogCloseSaleComponent implements OnInit {

  payment_method: string = 'efectivo';

  constructor(
    private dialogRef: MatDialogRef<DialogCloseSaleComponent>
  ) { }

  ngOnInit() {
  }

  closeSale() {
    this.dialogRef.close({
      close: true,
      payment_method: this.payment_method
    });
  }

  cancel() {
    this.dialogRef.close({
      close: false
    });
  }
}
