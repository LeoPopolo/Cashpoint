import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Product } from '../home/product/product.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  endpoint: string = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient
  ) { }

  async getProducts(filter: any) {

    let params = {
      page: filter.page,
      name: filter.name,
      brand: filter.brand,
      barcode: filter.barcode,
    };

    const response: any = await this.httpClient.get<any>(`${this.endpoint}/api/product`, {params: params}).toPromise();

    return response.data;
  }

  async createProduct(data: Product) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const response: any = await this.httpClient.post<any>(`${this.endpoint}/api/product`, data, {headers: headers}).toPromise();

    return response;
  }

  async identifyById(id: number) {

    const response: any = await this.httpClient.get<any>(`${this.endpoint}/api/product/${id}`).toPromise();

    return response;
  }

  async setName(id: number, name: string) {

    const body = {
      name: name
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/product/name/${id}`, body).toPromise();

    return response;
  }

  async setDescription(id: number, description: string) {

    const body = {
      description: description
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/product/description/${id}`, body).toPromise();

    return response;
  }

  async setPrice(id: number, price: number) {

    const body = {
      price: price
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/product/price/${id}`, body).toPromise();

    return response;
  }

  async setStock(id: number, stock: number) {

    const body = {
      stock: stock
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/product/stock/${id}`, body).toPromise();

    return response;
  }

  async setBrand(id: number, brand: string) {

    const body = {
      brand: brand
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/product/brand/${id}`, body).toPromise();

    return response;
  }

  async setBarcode(id: number, barcode: string) {

    const body = {
      barcode: barcode
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/product/barcode/${id}`, body).toPromise();

    return response;
  }

  async deleteProduct(id: number) {

    const headers = new HttpHeaders({
      'Content-Type': 'text/plain'
    });

    const response: any = await this.httpClient.delete<any>(`${this.endpoint}/api/product/${id}`).toPromise();

    return response;
  }
}
