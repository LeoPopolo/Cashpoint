import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Brand } from '../../home/product/product.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dialog-add-brand',
  templateUrl: './dialog-add-brand.component.html',
  styleUrls: ['./dialog-add-brand.component.scss']
})
export class DialogAddBrandComponent implements OnInit {

  brandName: string = '';

  constructor(
    private dialogRef: MatDialogRef<DialogAddBrandComponent>,
    private productServices: ProductService
  ) { }

  ngOnInit(): void {
  }

  async addBrand() {

    const data: Brand = {
      name: this.brandName,
      provider_id: 0
    }

    await this.productServices.addBrand(data)
    .then(resp=>{
      this.dialogRef.close(resp.data);
    })
    .catch(err => {
      console.log(err);
      this.dialogRef.close(false);
    });
  }

}
