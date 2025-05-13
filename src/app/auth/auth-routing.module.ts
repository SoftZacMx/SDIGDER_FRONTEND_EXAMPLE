import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { VerifyUserComponent } from './components/verify-user/verify-user.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthGuard } from '../guards/auth.guard';
import { ResetPasswordGuard } from '../guards/reset-password.guard';

const routes: Routes = [
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'verify-user',
    component:VerifyUserComponent
  },
  {
    canActivate:[ResetPasswordGuard],
    path:'reset-password/:user_id',
    component:ResetPasswordComponent
  },
  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
