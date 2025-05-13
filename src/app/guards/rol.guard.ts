import { Injectable } from '@angular/core';
import {  CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { TokenService } from '../auth/services/token/token.service';
import Swal from 'sweetalert2';
import { fireErrorDialog } from '../shared/handlers/dialog.handler';
import { UserDataService } from '../shared/services/user-data/user-data.service';
@Injectable({
  providedIn: 'root'
})
export class RolhGuard implements CanActivate {

  constructor(
    private userDataService:UserDataService,
    private router:Router
    ){

  }

  canActivate():boolean{
    const rol = this.userDataService.getUserData().rol;

    if (rol != 'Waiter') {
      fireErrorDialog('Inicie sesión con un perfil de mesero').then(() => {
      })
      return false;

    }else{
      return true
    }
  }



}