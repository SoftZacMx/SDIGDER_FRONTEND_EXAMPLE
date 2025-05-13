import { Component, EventEmitter } from '@angular/core';
import { EmailValidator, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css']
})
export class VerifyUserComponent {

  action: string = '';




  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService
  ){}

  user_email = this.formBuilder.control('',[Validators.required,Validators.email])
  
  verify(){
    
    const email:string =this.user_email.value!


    this.authService.verifyUserExist(email)
      .subscribe({

        next:(res:IResponse) => {
          console.log('res verifyUserExist', res);
          

          if (res.result) {
            fireSuccessDialog('Usuario validado con éxito')
          }


        },

        error:(error) => {
          
          console.log('error',error);
          

          if (error.error.error) {

            switch (error.error.message) {
              case 'USER NOT FOUND':
                  fireErrorDialog('El usuario no existe')
                break;
            
              default:
                fireErrorDialog('Algo salió mal al tratar de iniciar verificar el usuario')
                break;
            }

          }


        }

      })

  }

}


