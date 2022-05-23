import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogAddEditProductComponent } from '../dialogs/dialog-add-edit-product/dialog-add-edit-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogAddEditProductComponent>,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openDialogCreateProduct() {
    const dialogOptions = {
      width: '500px',
    }

    this.dialog.open(DialogAddEditProductComponent, dialogOptions);
  }
}
