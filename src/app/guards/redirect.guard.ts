import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../auth/services/token/token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(
    private tokenService:TokenService,
    private router:Router
    ){

  }

  canActivate():boolean{
    const isValidToken = this.tokenService.isTokenValid();
    if (!isValidToken) {
      this.router.navigate(['/admin']);
      return false;

    }else{
      return true
    }
  }

}