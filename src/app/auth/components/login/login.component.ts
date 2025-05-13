import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IUserData } from '../../interfaces/user_date.interface';
import { AuthService } from '../../services/auth/auth.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { Router } from '@angular/router';
import { CashRegisterService } from 'src/app/admin/services/cash_register/cash-register.service';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {



  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private route:Router,
  ){}

  user_data = this.formBuilder.group({
    email: this.formBuilder.control('',[Validators.required,Validators.email]),
    password: this.formBuilder.control('',[Validators.required,Validators.min(5)])
  })






  login(){
    let user_data = this.user_data.value as IUserData
    this.authService.login(user_data)
      .subscribe({

        next:(res:IResponse) => {
          console.log('next data',res);
          
          if (res.result) {



          }

        },

        error:(error:any) => {
          console.log('ERROR - [LOGIN] -> Login component ', error);
          
          if (error.error.error == true) {
            switch (error.error.message) {
              case 'PASSWORD INCORRECT':
                fireErrorDialog('Correo o contraseña incorrectos')
                break;
              case 'USER NOT FOUND':
                fireErrorDialog('El usuario no esta registrado')
                break;
              case 'USER DO NOT HAVE AN ASOCIATED CASH REGISTER':
                fireErrorDialog('El usuario no tiene ninguna caja asociada')
                break;
              default:
                fireErrorDialog('Algo salió mal al tratar de iniciar sesión')
                break;
            }
          }
        }
      }
      )

  }

  redirect(){
    this.route.navigate(['/auth/verify-user'])
  }



  

  

}
