import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenService } from '../token/token.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';
import { IUserData } from '../../interfaces/user_date.interface';
import { tap } from 'rxjs';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { Router } from '@angular/router';
import { checkTokenSetPassword } from 'src/app/interceptors/token-set-password/token.set-password.interceptor';
import { CashRegisterService } from 'src/app/admin/services/cash_register/cash-register.service';
import { fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URLS = environment.API_URSL;
  user_id = this.userDataService.getUserData().id
  user =  this.userDataService.getUserData()

  constructor(
    private http:HttpClient,
    private tokenService:TokenService,
    private userDataService:UserDataService,
    private router:Router,
    private cashRegisterService:CashRegisterService,

    ){ 

    }

  login(user_data:IUserData){
    return this.http.post<IResponse>(`${this.API_URLS.API_AUTH.LOGIN}`,user_data)
    .pipe(
      tap( (res:IResponse) => {   
        
         this.userDataService.setUserData(res.data.user) //Save the user data info on cookies
         this.tokenService.saveToken(res.data.token) //Save the token on cookies
         const token = getCookie('token')


        //If user rol is Waiter
        if (this.userDataService.getUserData().rol == 'Waiter') {


          //Verify if cash register is open
          this.cashRegisterService.verifyOpeningCashRegister(this.userDataService.getUserData().cash_register_id)
          .subscribe({

            //Cash register is open
            next: (res:IResponse) => {

              
              console.log('verifyOpeningCashRegister next res',res);
              
              //Cash register is open and have a valid token
              //save cash_register_opening_id on cookies and redirect to admin
              if (res.result  && token) {
                this.userDataService.setUserDataOpeningCashRegisterId(res.data[0].id)
                this.router.navigate(['/admin'])

              }

              
            },

            //Cash register is not open
            error: (error:any) => {

              console.log('verifyOpeningCashRegister error res',error);

              //Evaluete if have an error on res
              if (error.error.error) {

                  //Evalute kind message error and fire the message
                  switch (error.error.message) {
                    case 'Cash register is not open':
                        fireErrorDialog('No tiene la caja aperturada')
                      break;
                  
                    default:
                      fireErrorDialog('Algo salió mal al tratar de validar la apertura de caja')
  
                      break;
                  }


                  //Remove user data saved on cookies and remove token service
                  this.userDataService.removeUserData()
                  this.tokenService.removeToken()
              }
            }
          })  
        }else{ //If not is a Waiter
          if (token) {
            //Only redirect to admin module
            this.router.navigate(['/admin'])
          }
        }







      })
    )
  }


  logout(){
    this.tokenService.removeToken();
    this.router.navigate(['auth/login'])
  }
  
  verifyUserExist(email:string){
    const data = {
      email:email
    }
    return this.http.post<IResponse>(`${this.API_URLS.API_AUTH.VERIFY_USER}`,data)
      .pipe(
        tap((res:IResponse) => {
          this.tokenService.saveToken(res.data.token,true)
          const user_id = res.data.id
          const token = getCookie('pass-token')
          if (token) {
            this.router.navigate(['auth/reset-password',user_id])
          }
        })
      
  
      )
  }

  resetPassword(data:any,user_id:number){    
    return this.http.put<IResponse>(`${this.API_URLS.API_AUTH.RESET_PASSWORD}/${user_id}`,data,{context:checkTokenSetPassword()})
  }




}
