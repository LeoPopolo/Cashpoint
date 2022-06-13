import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from '../../home/customer/customer.component';

@Component({
  selector: 'app-dialog-add-edit-customer',
  templateUrl: './dialog-add-edit-customer.component.html',
  styleUrls: ['./dialog-add-edit-customer.component.scss']
})
export class DialogAddEditCustomerComponent implements OnInit {

  addCustomerForm: FormGroup = this.createForm();
  editBool: boolean = false;

  oldCustomer: Customer = new Customer();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogAddEditCustomerComponent>,
    private customerServices: CustomerService,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar
  ) { }

  async ngOnInit() {
    if (this.data.edit) {
      this.editBool = true;

      this.loadOldCustomer(this.data.id);
    }
  }

  async loadOldCustomer(id: number) {
    await this.identifyById(id).then(()=>{
      this.addCustomerForm.setValue(
        {
          name: this.oldCustomer.name,
          identifier: this.oldCustomer.identifier,
          phone_number: this.oldCustomer.phone_number,
          iva_responsability: this.oldCustomer.iva_responsability,
        }
      );
    });
  }

  async saveChanges() {
    let changes: boolean = false;

    if (this.addCustomerForm.value.name !== this.oldCustomer.name)
      await this.setName(this.addCustomerForm.value.name).then(() => changes = true);

    if (this.addCustomerForm.value.identifier !== this.oldCustomer.identifier)
      await this.setIdentifier(this.addCustomerForm.value.identifier).then(() => changes = true);

    if (this.addCustomerForm.value.phone_number !== this.oldCustomer.phone_number)
      await this.setPhone(this.addCustomerForm.value.phone_number).then(() => changes = true);

    if (this.addCustomerForm.value.iva_responsability !== this.oldCustomer.iva_responsability)
      await this.setResponsability(this.addCustomerForm.value.iva_responsability).then(() => changes = true);

    if (changes) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(false);
    }
  }

  async setName(name: string) {
    await this.customerServices.setName(this.data.id, name).catch(err => console.log(err));
  }

  async setPhone(phone: string) {
    await this.customerServices.setPhone(this.data.id, phone).catch(err => console.log(err));
  }

  async setResponsability(responsability: string) {
    await this.customerServices.setResponsability(this.data.id, responsability).catch(err => console.log(err));
  }

  async setIdentifier(identifier: string) {
    await this.customerServices.setIdentifier(this.data.id, identifier).catch(err => console.log(err));
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      name: ['', Validators.required],
      identifier: [''],
      phone_number: ['', Validators.required],
      iva_responsability: ['CONSUMIDOR FINAL', Validators.required]
    });

    return form;
  }

  async validateForm() {

    if (this.addCustomerForm.valid) {
      const customerData: Customer = {
        name: this.addCustomerForm.value.name,
        identifier: this.addCustomerForm.value.identifier,
        phone_number: this.addCustomerForm.value.phone_number,
        iva_responsability: this.addCustomerForm.value.iva_responsability
      }

      await this.createCustomer(customerData);

    } else {
      this.openSnackbar('Faltan completar campos');
    }
  }

  async createCustomer(data: Customer) {
    await this.customerServices.createCustomer(data).then(()=>{
      this.dialogRef.close(true);
    })
    .catch(err => {
      this.dialogRef.close(false);
      console.log(err);
    });
  }

  async identifyById(id: number) {
    await this.customerServices.identifyById(id).then(response=>{
      this.oldCustomer = response.data;
    })
    .catch(err => {
      console.log(err);
    });
  }

  openSnackbar(message: string) {
    this.snackbar.open(message, 'OK', {
      duration: 3000,
      panelClass: 'snack-bar-style'
    });
  }

}
