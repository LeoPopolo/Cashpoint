import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  endpoint: string = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient
  ) { }

  async login(data: any) {

    const headers = new HttpHeaders({
      'Content-Type':  'application/json',
    })

    const response: any = await this.httpClient.post<any>(`${this.endpoint}/api/auth/signin`, JSON.stringify(data),
      {headers: headers, observe: "response"}).toPromise();

    return response;
  }

  async createUser(data: any) {

    const headers = new HttpHeaders({
      'Content-Type':  'application/json',
    })

    const response: any = await this.httpClient.post<any>(`${this.endpoint}/api/auth/signup`, data,
      {headers: headers, observe: "response"}).toPromise();

    return response;
  }
}
