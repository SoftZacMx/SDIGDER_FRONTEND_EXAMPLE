import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { UsersService } from 'src/app/admin/services/users/users.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {


  //CLASS VARIABLES
  roles = [
    {
      description: 'Administrador',
      value: 'Administrator'
    },
    {
      description: 'Mesero',
      value: 'Waiter'
    },
    {
      description: 'Gerente',
      value: 'Manager'
    }
  ]


  status_options = [
    {
      description: 'Activo',
      value: true
    },
    {
      description: 'Inactivo',
      value: false
    }
  ]


  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UsersService
  ) {
  }


  ngOnInit(): void {
    this.setValues()
  }


  /*
  name:string,
  last_name:string,
  second_last_name:string,
  email: string,
  password: string,
  phone:number,
  status:boolean,
  rol:string
*/

  user = this.formBuilder.group({
    id: this.formBuilder.control(0, [Validators.required, Validators.min(1)]),
    name: this.formBuilder.control('', [Validators.required, Validators.pattern('[a-zA-záéíóúñÑ ]*')]),
    last_name: this.formBuilder.control('', [Validators.required, Validators.pattern('[a-zA-záéíóúñÑ ]*')]),
    second_last_name: this.formBuilder.control('', [Validators.required, Validators.pattern('[a-zA-záéíóúñÑ ]*')]),
    email: this.formBuilder.control('', [Validators.required, Validators.email]),
    phone: this.formBuilder.control('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]),
    status: this.formBuilder.control(true, [Validators.required]),
    rol: this.formBuilder.control('Administrador', [Validators.required]),
  })


  close() {

    this.dialogRef.close()

  }

  edit() {

    let user: IUser = this.user.value as IUser
    this.userService.editUser(user)
      .subscribe({

        next: (res: IResponse) => {

          console.log('editUser next res', res);

          if (res.result) {
            fireSuccessDialog('Usuario actualizado con éxito')
            this.close()
          }
        },

        error: (res: any) => {

          console.log('editUser error res', res);

          if (res.error.error) {

            switch (res.error.message) {
              case 'User already exist':
                fireErrorDialog('Ya existe un usuario con ese correo')
                break;

              default:
                fireErrorDialog('Algo salío mal al tratar de registrar el usuario')
                break;
            }

          }

        }

      })


  }

  setValues() {
    this.user.controls.id.setValue(this.data.user.id)
    this.user.controls.name.setValue(this.data.user.name)
    this.user.controls.last_name.setValue(this.data.user.last_name)
    this.user.controls.second_last_name.setValue(this.data.user.second_last_name)
    this.user.controls.email.setValue(this.data.user.email)
    this.user.controls.phone.setValue(this.data.user.phone)
    this.data.user.status == true ? this.user.controls.status.setValue(true) : this.user.controls.status.setValue(false)
    switch (this.data.user.rol) {
      case 'Administrador':
        this.user.controls.rol.setValue('Administrator')
        break;
      case 'Gerente':
        this.user.controls.rol.setValue('Manager')
        break;

      default:
        this.user.controls.rol.setValue('Waiter')
        break;
    }



  }


}
