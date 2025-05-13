import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { SaourceCardComponent } from './components/saource-card/saource-card.component';
import { SaourcesPipe } from './pipes/saources.pipe';
@NgModule({
  declarations: [
    SaourceCardComponent,
    SaourcesPipe
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    SaourceCardComponent,
    SaourcesPipe
  ]
})
export class SharedModule { }
