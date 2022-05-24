import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../home/product/product.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  endpoint: string = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient
  ) { }

  async getProducts() {

    const response: any = await this.httpClient.get<any>(`${this.endpoint}/api/product`).toPromise();

    return response;
  }

  async createProduct(data: Product) {

    const headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    delete data.id;

    const response: any = await this.httpClient.post<any>(`${this.endpoint}/api/product`, data, {headers: headers}).toPromise();

    return response;
  }
}
