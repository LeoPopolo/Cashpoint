import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../home/customer/customer.component';

@Component({
  selector: 'app-dialog-close-sale',
  templateUrl: './dialog-close-sale.component.html',
  styleUrls: ['./dialog-close-sale.component.scss']
})
export class DialogCloseSaleComponent implements OnInit {

  paymentMethod: string = 'efectivo';
  customerList: Array<Customer> = [];
  selectedCustomerID: number = 1;

  constructor(
    private dialogRef: MatDialogRef<DialogCloseSaleComponent>,
    private customerServices: CustomerService
  ) { }

  async ngOnInit() {
    await this.getCustomers();
  }

  async getCustomers() {
    await this.customerServices.getCustomers()
    .then(response => {
      this.customerList = response
    })
    .catch(err => console.log(err));
  }

  closeSale() {
    this.dialogRef.close({
      close: true,
      payment_method: this.paymentMethod,
      customer_id: this.selectedCustomerID
    });
  }

  cancel() {
    this.dialogRef.close({
      close: false
    });
  }
}
