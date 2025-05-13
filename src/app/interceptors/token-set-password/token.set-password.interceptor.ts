import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContext,
  HttpContextToken
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/auth/services/token/token.service';

const CHECK_TOKEN_SET_PASSWORD= new HttpContextToken<boolean>(() => false);
export function checkTokenSetPassword() {
  return new HttpContext().set(CHECK_TOKEN_SET_PASSWORD, true)
}


@Injectable()
export class TokenInterceptorSetPassword implements HttpInterceptor {

  constructor(private tokenService: TokenService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.context.get(CHECK_TOKEN_SET_PASSWORD)) {
      return this.addToken(request, next);
    }
    return next.handle(request);
  }

  private addToken(request: HttpRequest<unknown>, next: HttpHandler) {
    const acces_token = this.tokenService.getToken(true) 
       
    if (acces_token) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Barer ${acces_token}`)
      });
      return next.handle(authRequest)
    }

    return next.handle(request)
  }
}

