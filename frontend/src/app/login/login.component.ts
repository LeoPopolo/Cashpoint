import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private authServices: AuthService,
    private snackbar: MatSnackBar
  ) {  }

  ngOnInit(): void {
  }

  async validateLogin(){

    if(this.user.username !== "" && this.user.password !== "" &&  this.user.username && this.user.password) {

      await this.login();
    } else {
      this.openSnackbar(" Falta completar campos ");
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
          this.openSnackbar('usuario o contraseña incorrectos');
        }
      });
  }

  openSnackbar(message: string) {
    this.snackbar.open(message, 'OK', {
      duration: 3000,
      panelClass: 'snack-bar-style'
    });
  }
}
