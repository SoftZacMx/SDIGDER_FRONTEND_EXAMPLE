import { style } from '@angular/animations';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { IOrder } from 'src/app/admin/interfaces/orders/order.interface';
import { OrdersService } from 'src/app/admin/services/orders/orders.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';

@Component({
  selector: 'app-print-kitchen-ticket',
  templateUrl: './print-kitchen-ticket.component.html',
  styleUrls: ['./print-kitchen-ticket.component.css']
})
export class PrintKitchenTicketComponent {

  constructor(
    public dialogRef: MatDialogRef<PrintKitchenTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService:OrdersService,
    private userDataService:UserDataService
    ){}

    order:IOrder = {
      date: '',
      status: false,
      payment_method: 0,
      total: 0,
      subtotal: 0,
      iva: 0,
      cash_register_id: 0,
      saources: [],
      user_id: 0,
      table_number: 0,
      tip: 0,
      origin: '',
      note:''
    }

    date:string = moment().format('YYYY-MM-DD hh:mm:ss')
    user:string = `${this.userDataService.getUserData().name} ${this.userDataService.getUserData().lastname}`


  ngOnInit(): void {

    this.getOrder()
    this.getProducts()    
  }

  getOrder(){
    this.orderService.getOrder(this.data.order_id)
      .subscribe((res:IResponse) => {
        if (res.result) {
          this.order = res.data[0]          
        }
      })
  }

  getProducts(){
    this.orderService.getSaourcesOrder(this.data.order_id)
      .subscribe((res:IResponse) => {
        if (res.result) {
          this.order.saources = res.data          
        }
      })
  }

  print(){
    
    var ficha = document.getElementById('ticket-content');
    var ventimp = window.open(' ', 'popimpr');
    ventimp.document.write(ficha.innerHTML);
    ventimp.document.documentElement.style.margin = '0px';
    ventimp.document.documentElement.style.padding = '0px';
    ventimp.document.documentElement.style.fontSize = '19px';
    ventimp.document.documentElement.style.fontFamily = 'Arial';
    ventimp.document.documentElement.style.overflowWrap = 'break-word';  // Actualizado
    ventimp.document.documentElement.style.textAlign = 'left';
    ventimp.document.documentElement.style.fontWeight = 'bold';

    


	  ventimp.document.close();
	  ventimp.print( );
	  ventimp.close();
  }

  close(){
    this.dialogRef.close()
  }

}
