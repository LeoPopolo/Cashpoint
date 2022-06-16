import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CashRegisterMovements } from 'src/app/home/cash-register/cash-register.component';

@Component({
  selector: 'app-dialog-see-outgoings',
  templateUrl: './dialog-see-outgoings.component.html',
  styleUrls: ['./dialog-see-outgoings.component.scss']
})
export class DialogSeeOutgoingsComponent implements OnInit {

  outgoingsList: Array<CashRegisterMovements> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogSeeOutgoingsComponent>
  ) { }

  ngOnInit(): void {
    this.outgoingsList = this.data.outgoings;
  }

}
