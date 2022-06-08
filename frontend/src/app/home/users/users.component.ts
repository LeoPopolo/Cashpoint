import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogAddEditUserComponent } from '../../dialogs/dialog-add-edit-user/dialog-add-edit-user.component';
import { AuthService } from '../../services/auth.service';
import { DialogConfirmComponent } from '../../dialogs/dialog-confirm/dialog-confirm.component';

export class User {
  id?: number = 0;
  username: string = '';
  name: string = '';
  surname: string = '';
  email: string = '';
  role: string = '';
  password?: string = '';
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  usersList: Array<User> = [];

  constructor(
    private authServices: AuthService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  async ngOnInit() {
    await this.getUsers();
  }

  async getUsers() {
    await this.authServices.getUsers()
    .then(response =>  {
      this.usersList = response.data;
    })
    .catch(err => {
      console.log(err);
    });
  }

  async deleteUser(id: number) {
    await this.authServices.deleteUser(id).then(async () => {
      this.openSnackbar('Usuario eliminado con éxito');
      await this.getUsers();
    });
  }

  openDialogCreateEditUser(action: string, id?: number) {
    const dialogOptions = {
      width: '350px',
      data: {
        edit: action === 'edit' ? true : false,
        id: id
      }
    }

    const dialogRef = this.dialog.open(DialogAddEditUserComponent, dialogOptions);

    dialogRef.afterClosed().subscribe( async result => {

      if (result) {
        if (action === 'edit') {
          this.openSnackbar("Usuario modificado con éxito");
        } else if (action === 'create') {
          this.openSnackbar("Usuario agregado con éxito");
        }
      } else if (result === false) {
        if (action === 'create') {
          this.openSnackbar("Error al intentar agregar el usuario");
        }
      }

      await this.getUsers();
    });
  }

  openDialogDelete(id: number, name: string) {
    const dialogOptions = {
      width: '350px',
      data: {
        message: `¿Desea eliminar el usuario ${name}?`
      }
    }

    const dialogRef = this.dialog.open(DialogConfirmComponent, dialogOptions);

    dialogRef.afterClosed().subscribe( async result => {

      if (result) {
        await this.deleteUser(id);
      }
    });
  }

  parseRole(role: string) {
    switch(role) {
      case 'admin':
      return 'Administrador';
      case 'seller':
      return 'Vendedor';
      default:
      return '--';
    }
  }

  openSnackbar(message: string) {
    this.snackbar.open(message, 'OK', {
      duration: 3000,
      panelClass: 'snack-bar-style'
    });
  }
}
