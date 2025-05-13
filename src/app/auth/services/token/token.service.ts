import { Injectable } from '@angular/core';
import { getCookie,setCookie,removeCookie } from 'typescript-cookie';
import { jwtDecode,JwtPayload } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class TokenService {


  constructor() { }

  saveToken(token:string,resetPassword?:boolean) {

    if (!resetPassword) {
      setCookie('token',token, {
        expires: 1,
        path: '/'
    })
    }else{
      setCookie('pass-token',token, {
        expires: 1,
        path: '/'
    })
    }

  }

  getToken(resetPasswordToken?:boolean){

    let token = undefined
    resetPasswordToken == true ? token = getCookie('pass-token') : token = getCookie('token')
    return token
  }

  removeToken(removeSetPasswordToken?:boolean){
    if (!removeSetPasswordToken) {
      removeCookie('token');

    }else{
      removeCookie('pass-token');
    }
  }

  isTokenValid(validResetPasswordToken?:boolean){

    let token = undefined

    if (!validResetPasswordToken) {
     token =  this.getToken();
      if(!token){
  
        return false;
      }
    }else{
       token =  this.getToken(true);
      if(!token){
  
        return false;
      }

      return token

      
    }



    const decodeToken = jwtDecode<JwtPayload>(token)



    if(decodeToken && decodeToken?.exp){
      const tokenDate = new Date(0)
      tokenDate.setUTCSeconds(decodeToken.exp)
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }

    return false
  }


  
}
