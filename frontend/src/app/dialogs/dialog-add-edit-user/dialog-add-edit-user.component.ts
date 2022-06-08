import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../home/users/users.component';

@Component({
  selector: 'app-dialog-add-edit-user',
  templateUrl: './dialog-add-edit-user.component.html',
  styleUrls: ['./dialog-add-edit-user.component.scss']
})
export class DialogAddEditUserComponent implements OnInit {

  addUserForm: FormGroup = this.createForm();
  editBool: boolean = false;

  oldUser: User = new User();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogAddEditUserComponent>,
    private authServices: AuthService,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar
  ) { }

  async ngOnInit() {
    if (this.data.edit) {
      this.editBool = true;

      this.loadOldUser(this.data.id);
    }
  }

  async loadOldUser(id: number) {
    await this.identifyById(id).then(()=>{
      this.addUserForm.patchValue(
        {
          name: this.oldUser.name,
          surname: this.oldUser.surname,
          username: this.oldUser.username,
          email: this.oldUser.email,
          role: this.oldUser.role
        }
      );
    });

    this.addUserForm.controls['username'].disable();
  }

  async saveChanges() {
    let changes: boolean = false;

    if (this.addUserForm.value.name !== this.oldUser.name)
      await this.setName(this.addUserForm.value.name).then(() => changes = true);

    if (this.addUserForm.value.surname !== this.oldUser.surname)
      await this.setSurname(this.addUserForm.value.surname).then(() => changes = true);

    if (this.addUserForm.value.email !== this.oldUser.email)
      await this.setEmail(this.addUserForm.value.email).then(() => changes = true);

    if (this.addUserForm.value.role !== this.oldUser.role)
      await this.setRole(this.addUserForm.value.role).then(() => changes = true);

    if (changes) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(false);
    }
  }

  async setName(name: string) {
    await this.authServices.setName(this.data.id, name).catch(err => console.log(err));
  }

  async setSurname(surname: string) {
    await this.authServices.setSurname(this.data.id, surname).catch(err => console.log(err));
  }

  async setRole(role: string) {
    await this.authServices.setRole(this.data.id, role).catch(err => console.log(err));
  }

  async setEmail(email: string) {
    await this.authServices.setEmail(this.data.id, email).catch(err => console.log(err));
  }

  private createForm(): FormGroup {
    const form = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      role: ['admin', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
    });

    return form;
  }

  async validateForm() {

    if (this.addUserForm.valid) {
      const userData: User = {
        name: this.addUserForm.value.name,
        surname: this.addUserForm.value.surname,
        username: this.addUserForm.value.username,
        email: this.addUserForm.value.email,
        role: this.addUserForm.value.role,
        password: this.addUserForm.value.password1
      }

      await this.createUser(userData);

    } else {
      this.openSnackbar('Faltan completar campos');
    }
  }

  async createUser(data: User) {
    await this.authServices.createUser(data).then(()=>{
      this.dialogRef.close(true);
    })
    .catch(err => {
      this.dialogRef.close(false);
      console.log(err);
    });
  }

  async identifyById(id: number) {
    await this.authServices.identifyById(id).then(response=>{
      this.oldUser = response.data;
    })
    .catch(err => {
      console.log(err);
    });
  }

  openSnackbar(message: string) {
    this.snackbar.open(message, 'OK', {
      duration: 3000,
      panelClass: 'snack-bar-style'
    });
  }
}
