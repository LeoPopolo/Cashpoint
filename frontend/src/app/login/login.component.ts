import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export class UserLogin {
  username: string = '';
  password: string = '';
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: UserLogin = new UserLogin();

  constructor(
    private router: Router,
    private authServices: AuthService
  ) {  }

  ngOnInit(): void {
  }

  async validateLogin(){

    if(this.user.username !== "" && this.user.password !== "" &&  this.user.username && this.user.password) {

      await this.login();
    } else {
      alert(" Falta completar campos ");
    }
  }

  async login() {
    await this.authServices.login(this.user)
      .then(data => {
        if (data.headers.get('Authorization') !== null) {
          localStorage.setItem('token', data.headers.get('Authorization'));
          localStorage.setItem('userData', data.body.data);

          this.router.navigate(['/home']);
        }
      })
      .catch(err => {
        console.log(err);

        if (err.error.error === 'username or password incorrect') {
          alert('usuario o contraseña incorrectos');
        }
      });
  }

}
