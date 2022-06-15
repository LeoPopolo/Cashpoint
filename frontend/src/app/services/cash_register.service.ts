import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CashRegisterService {

  endpoint: string = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient
  ) { }

  async getCashRegisters(filter: any) {

    let params = {
      page: filter.page,
      date_from: filter.date_from,
      date_to: filter.date_to
    };

    const response: any = await this.httpClient.get<any>(`${this.endpoint}/api/cash_register`, {params: params}).toPromise();

    return response.data;
  }

  async createCashRegister(data: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const response: any = await this.httpClient.post<any>(`${this.endpoint}/api/cash_register`, data, {headers: headers}).toPromise();

    return response;
  }

  async identifyById(id: number) {

    const response: any = await this.httpClient.get<any>(`${this.endpoint}/api/cash_register/${id}`).toPromise();

    return response;
  }

  async isAnyOpen() {

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/cash_register/is_any_open`, null).toPromise();

    return response;
  }

  async close() {

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/cash_register/close`, null).toPromise();

    return response;
  }

  async substract(data: any) {

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/cash_register/substract`, data).toPromise();

    return response;
  }

  async getOpenCashRegister() {

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/cash_register/get_open`, null).toPromise();

    return response;
  }

  async isFromToday() {

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/cash_register/is_from_today`, null).toPromise();

    return response;
  }
}
