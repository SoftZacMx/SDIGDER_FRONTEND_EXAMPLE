import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TokenInterceptor } from './interceptors/token/token.interceptor.interceptor';
import { TokenInterceptorSetPassword } from './interceptors/token-set-password/token.set-password.interceptor';
import { MaterialModule } from './material/material.module'

import { LucideAngularModule, File, Home, Menu, UserCheck } from 'lucide-angular';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MaterialModule,
    LucideAngularModule,
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass:TokenInterceptor,
      multi: true,
      
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass:TokenInterceptorSetPassword,
      multi: true,
      
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
