import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Brand } from '../../home/product/product.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dialog-adjust-product-price',
  templateUrl: './dialog-adjust-product-price.component.html',
  styleUrls: ['./dialog-adjust-product-price.component.scss']
})
export class DialogAdjustProductPriceComponent implements OnInit {

  radioButtonColor: ThemePalette;

  brandList: Array<Brand> = [];

  percentage: number = 0;
  isIncrement: boolean = true;
  selectedBrand: Brand = new Brand();

  constructor(
    private dialogRef: MatDialogRef<DialogAdjustProductPriceComponent>,
    private productServices: ProductService
  ) { }

  async ngOnInit() {
    this.radioButtonColor = 'primary';
    await this.getBrands();
  }

  async getBrands() {
    await this.productServices.getBrands()
    .then(response => {
      this.brandList = response.data.brands;
      this.selectedBrand = this.brandList[0];
    });
  }

  async setPrice(percentage: number) {
    await this.productServices.setPriceByBrand(this.selectedBrand, percentage)
    .then(()=>{
      this.dialogRef.close({
        anyAction: true,
        error: false
      });
    })
    .catch(err=>{
      console.log(err);
      this.dialogRef.close({
        anyAction: true,
        error: true
      });
    });
  }

  async adjustPrice() {
    let tmp_percentage: number = this.percentage;

    if (!this.isIncrement) {
      tmp_percentage *= -1;
    }

    await this.setPrice(tmp_percentage);
  }
}
