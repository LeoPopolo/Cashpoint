import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dialog-add-edit-product',
  templateUrl: './dialog-add-edit-product.component.html',
  styleUrls: ['./dialog-add-edit-product.component.scss']
})
export class DialogAddEditProductComponent implements OnInit {

  addProductForm: FormGroup = this.createForm();

  constructor(
    private productServices: ProductService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      stock: ['', Validators.required],
      price: ['', Validators.required],
      barcode: ['', Validators.required],
    });

    return form;
  }
}
