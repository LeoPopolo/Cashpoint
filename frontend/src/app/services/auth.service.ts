import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor (
    private httpClient: HttpClient
  ) { }

  async login() {
    const response = await this.httpClient.get("api").toPromise();

    return response;
  }
}
