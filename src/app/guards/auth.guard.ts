import { Injectable } from '@angular/core';
import {  CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { TokenService } from '../auth/services/token/token.service';
import Swal from 'sweetalert2';
import { fireErrorDialog } from '../shared/handlers/dialog.handler';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private tokenService:TokenService,
    private router:Router
    ){

  }

  canActivate():boolean{
    const isValidToken = this.tokenService.isTokenValid();
    if (!isValidToken) {
      fireErrorDialog('La sesión a expirado').then(() => {
        this.router.navigate(['/auth/login']);
      })
      return false;

    }else{
      return true
    }
  }



}