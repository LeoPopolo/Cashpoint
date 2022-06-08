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

    const response: any = await this.httpClient.post<any>(`${this.endpoint}/api/auth/`, data,
      { headers: headers }
    ).toPromise();

    return response;
  }

  async getUsers() {

    const response: any = await this.httpClient.get<any>(`${this.endpoint}/api/auth/`).toPromise();

    return response;
  }

  async identifyById(id: number) {

    const response: any = await this.httpClient.get<any>(`${this.endpoint}/api/auth/${id}`).toPromise();

    return response;
  }

  async setName(id: number, name: string) {

    const body = {
      name: name
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/auth/name/${id}`, body).toPromise();

    return response;
  }

  async setSurname(id: number, surname: string) {

    const body = {
      surname: surname
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/auth/surname/${id}`, body).toPromise();

    return response;
  }

  async setRole(id: number, role: string) {

    const body = {
      role: role
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/auth/role/${id}`, body).toPromise();

    return response;
  }

  async setEmail(id: number, email: string) {

    const body = {
      email: email
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/auth/email/${id}`, body).toPromise();

    return response;
  }

  async setPassword(id: number, password: string) {

    const body = {
      password: password
    }

    const response: any = await this.httpClient.patch<any>(`${this.endpoint}/api/auth/password/${id}`, body).toPromise();

    return response;
  }

  async deleteUser(id: number) {

    const response: any = await this.httpClient.delete<any>(`${this.endpoint}/api/auth/${id}`).toPromise();

    return response;
  }
}
