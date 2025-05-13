import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from './admin/components/sidenav/sidenav.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path:'auth',
    loadChildren: () => import("../app/auth/auth.module").then(m=>m.AuthModule),
  },
  {
    path:'admin',
    canActivate:[AuthGuard],
    loadChildren: () => import("../app/admin/admin.module").then(m=>m.AdminModule),
    component: SidenavComponent
  },
  {
    path:'public',
    loadChildren: () => import("../app/public/public.module").then(m=>m.PublicModule),
  },
  {
    path:'',
    redirectTo:'auth',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
