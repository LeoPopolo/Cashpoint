import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user : string = "";
  password : string = "";


  constructor(
    private router: Router
  ) {  }

  ngOnInit(): void {
  }


  login(){


    if(this.user !== "" && this.password !== "" &&
    this.user !== undefined && this.password !== undefined){
      this.router.navigate(['home']);
    }else {alert(" Falta completar campos ") }
  }
}
