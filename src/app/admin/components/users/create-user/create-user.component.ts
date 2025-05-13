import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { UsersService } from 'src/app/admin/services/users/users.service';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {


  //CLASS VARIABLES
  roles = [
    {
      description:'Administrador',
      value:'Administrator'
    },
    {
      description:'Mesero',
      value:'Waiter'
    },
    {
      description:'Gerente',
      value:'Manager'
    }
  ]

  status_options = [
    {
      description:'Activo',
      value:true
    },
    {
      description:'Inactivo',
      value:false
    }
  ]


  constructor(
    private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService:UsersService
    ){
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
    name: this.formBuilder.control('',[Validators.required,Validators.pattern('[a-zA-záéíóúñÑ ]*')]),
    last_name: this.formBuilder.control('',[Validators.required,Validators.pattern('[a-zA-záéíóúñÑ ]*')]),
    second_last_name: this.formBuilder.control('',[Validators.required,Validators.pattern('[a-zA-záéíóúñÑ ]*')]),
    email: this.formBuilder.control('',[Validators.required,Validators.email,Validators.pattern('[0-9a-zñ._@]*')]),
    phone: this.formBuilder.control('',[Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern('[0-9]*')]),
    status: this.formBuilder.control(true,[Validators.required]),
    rol: this.formBuilder.control('Manager',[Validators.required]),
    password: this.formBuilder.control('',[Validators.required,Validators.minLength(5)])

  })


  close(){

    this.dialogRef.close()

  }

  create(){

    let user:IUser = this.user.value as IUser
    this.userService.createUser(user)
      .subscribe({

        next:(res:IResponse) => {

          console.log('createUser next res',res);
          
          if (res.result) {
            fireSuccessDialog('Usuario registrado con éxito')
            this.close()
          }
        },

        error:(res:any) => {
          
          console.log('createUser error res',res);

          if(res.error.error){

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



}
