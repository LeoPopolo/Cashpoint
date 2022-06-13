import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogAddEditCustomerComponent } from '../../dialogs/dialog-add-edit-customer/dialog-add-edit-customer.component';
import { CustomerService } from 'src/app/services/customer.service';
import { DialogConfirmComponent } from '../../dialogs/dialog-confirm/dialog-confirm.component';

export class Customer {
  id?: number = 0;
  name: string = '';
  identifier: string = '';
  phone_number: string = '';
  iva_responsability: string = '';
  creation_timestamp?: Date = new Date();
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  customersList: Array<Customer> = [];

  constructor(
    private customerServices: CustomerService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  async ngOnInit() {
    await this.getCustomers();
  }

  async getCustomers() {
    await this.customerServices.getCustomers()
    .then(response =>  {
      this.customersList = response;
    })
    .catch(err => {
      console.log(err);
    });
  }

  async deleteCustomer(id: number) {
    await this.customerServices.deleteCustomer(id).then(async () => {
      this.openSnackbar('Cliente eliminado con éxito');
      await this.getCustomers();
    });
  }

  openDialogCreateEditCustomer(action: string, id?: number) {
    const dialogOptions = {
      width: '350px',
      data: {
        edit: action === 'edit' ? true : false,
        id: id
      }
    }

    const dialogRef = this.dialog.open(DialogAddEditCustomerComponent, dialogOptions);

    dialogRef.afterClosed().subscribe( async result => {

      if (result) {
        if (action === 'edit') {
          this.openSnackbar("Cliente modificado con éxito");
        } else if (action === 'create') {
          this.openSnackbar("Cliente agregado con éxito");
        }
      } else if (result === false) {
        if (action === 'create') {
          this.openSnackbar("Error al intentar agregar el cliente");
        }
      }

      await this.getCustomers();
    });
  }

  openDialogDelete(id: number, name: string) {
    const dialogOptions = {
      width: '350px',
      data: {
        message: `¿Desea eliminar el cliente ${name}?`
      }
    }

    const dialogRef = this.dialog.open(DialogConfirmComponent, dialogOptions);

    dialogRef.afterClosed().subscribe( async result => {

      if (result) {
        await this.deleteCustomer(id);
      }
    });
  }

  openSnackbar(message: string) {
    this.snackbar.open(message, 'OK', {
      duration: 3000,
      panelClass: 'snack-bar-style'
    });
  }

}
