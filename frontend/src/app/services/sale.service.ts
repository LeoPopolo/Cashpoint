import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  endpoint: string = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient
  ) { }

  async getSales(filter: any) {

    let params = {
      page: filter.page,
      total: filter.total,
      payment_method: filter.payment_method === 'todos' ? null : filter.payment_method,
      date_from: filter.date_from,
      date_to: filter.date_to
    };

    const response: any = await this.httpClient.get<any>(`${this.endpoint}/api/sale`, {params: params}).toPromise();

    return response.data;
  }

  async createProduct(data: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const response: any = await this.httpClient.post<any>(`${this.endpoint}/api/product`, data, {headers: headers}).toPromise();

    return response;
  }

  async identifyById(id: number) {

    const response: any = await this.httpClient.get<any>(`${this.endpoint}/api/sale/${id}`).toPromise();

    return response;
  }

}
