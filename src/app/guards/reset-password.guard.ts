import { Injectable } from '@angular/core';
import {  CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { TokenService } from '../auth/services/token/token.service';
import { fireErrorDialog } from '../shared/handlers/dialog.handler';
@Injectable({
  providedIn: 'root'
})
export class ResetPasswordGuard implements CanActivate {

  constructor(
    private tokenService:TokenService,
    private router:Router
    ){

  }

  canActivate():boolean{
    const isValidToken = this.tokenService.isTokenValid(true);
    console.log('canActivate ResetPasswordGuard isValidToken',isValidToken);
    
    if (!isValidToken) {
      fireErrorDialog('El token para cambiar la contraseña a expirado').then
      (() => {
        this.router.navigate(['/auth/login']);
      })
      return false;


    }else{
      return true
    }
  }



}