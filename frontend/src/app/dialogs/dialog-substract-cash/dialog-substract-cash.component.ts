import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-substract-cash',
  templateUrl: './dialog-substract-cash.component.html',
  styleUrls: ['./dialog-substract-cash.component.scss']
})
export class DialogSubstractCashComponent implements OnInit {

  amount: number = 0;
  description: string = '';
  user_owner_id: number = 0;

  constructor(
    private dialogRef: MatDialogRef<DialogSubstractCashComponent>
  ) { }

  ngOnInit() {
    const user_id = (JSON.parse(localStorage.getItem('userData')!)).id;

    this.user_owner_id = user_id;
  }

  substractCash() {
    this.dialogRef.close({
      amount: this.amount,
      description: this.description,
      user_owner_id: this.user_owner_id
    });
  }
}
