import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Customer } from '../home/customer/customer.component';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  endpoint: string = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient
  ) { }

  async getCustomers() {

    const response: any = await this.httpClient.get<any>(`${this.endpoint}/api/customer`).toPromise();

    return response.data;
  }

  async createCustomer(data: Customer) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const response: any = await this.httpClient.post<any>(`${this.endpoint}/api/customer`, data, {headers: headers}).toPromise();

    return response;
  }

  async identifyById(id: number) {

    const response: any = await this.httpClient.get<any>(`${this.endpoint}/api/customer/${id}`).toPromise();

    return response;
  }

  async setName(id: number, name: string) {

    const body = {
      name: name
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/customer/name/${id}`, body).toPromise();

    return response;
  }

  async setIdentifier(id: number, identifier: string) {

    const body = {
      identifier: identifier
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/customer/identifier/${id}`, body).toPromise();

    return response;
  }

  async setPhone(id: number, phone: string) {

    const body = {
      phone_number: phone
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/customer/phone/${id}`, body).toPromise();

    return response;
  }

  async setResponsability(id: number, responsability: string) {

    const body = {
      iva_responsability: responsability
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/customer/responsability/${id}`, body).toPromise();

    return response;
  }

  async reactivateCustomer(id: number) {

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/customer/reactivate/${id}`, null).toPromise();

    return response;
  }

  async deleteCustomer(id: number) {

    const headers = new HttpHeaders({
      'Content-Type': 'text/plain'
    });

    const response: any = await this.httpClient.delete<any>(`${this.endpoint}/api/customer/${id}`).toPromise();

    return response;
  }
}
