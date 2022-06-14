import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-open-cash-register',
  templateUrl: './dialog-open-cash-register.component.html',
  styleUrls: ['./dialog-open-cash-register.component.scss']
})
export class DialogOpenCashRegisterComponent implements OnInit {

  initialCash: number = 0;

  constructor(
    private dialogRef: MatDialogRef<DialogOpenCashRegisterComponent>
  ) { }

  ngOnInit() {
  }

  openCashRegister() {
    this.dialogRef.close(
      {
        initialCash: this.initialCash,
        open: true
      }
    );
  }
}
