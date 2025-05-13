import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute,Route,Router} from '@angular/router';
import { TokenService } from '../../services/token/token.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{






  constructor(
    private formBuilder:FormBuilder,
    private authService:AuthService,
    private activatedRoute:ActivatedRoute,
    private tokenService:TokenService,
    private router:Router
  ){}


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.user_id = parseInt(params.get('user_id')!)
      
    })
  }

  password = this.formBuilder.control('',[Validators.required,Validators.min(5)])
  verify_password = this.formBuilder.control('',[Validators.required,Validators.min(5)])
  user_id:number = 0

  set(){
        

    const data = {
      password:this.password.value!
    }

    this.authService.resetPassword(data,this.user_id)
      .subscribe({

        next:(res:IResponse) => {
          

          if (res.result) {
            fireSuccessDialog('Contraseña cambiada con éxito')
            const removeSetPasswordToken = true
            this.tokenService.removeToken(removeSetPasswordToken)
            this.router.navigate(['auth/login'])
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

  verifyPasswords():boolean{

    let status = false
    if ((this.password.value != this.verify_password.value) && (this.password.touched && this.verify_password.touched) ) {
      status = true
    } 

    return status
  }

}


