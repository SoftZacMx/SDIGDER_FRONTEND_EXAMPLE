import { Component, Input } from '@angular/core';
import { ISaource } from 'src/app/admin/interfaces/saources/saource.interface';

@Component({
  selector: 'app-saource-card',
  templateUrl: './saource-card.component.html',
  styleUrls: ['./saource-card.component.css']
})
export class SaourceCardComponent {

  @Input() saource!: ISaource;

}
