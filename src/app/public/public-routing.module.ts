import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DigitalMenuComponent } from './components/digital-menu/digital-menu.component';

const routes: Routes = [
  {
    path:'menu',
    component: DigitalMenuComponent

  },
  {
    path:'',
    redirectTo: 'menu',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
