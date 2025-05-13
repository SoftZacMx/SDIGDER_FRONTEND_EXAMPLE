import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { IOrder } from 'src/app/admin/interfaces/orders/order.interface';
import { CashRegisterService } from 'src/app/admin/services/cash_register/cash-register.service';
import { OrdersService } from 'src/app/admin/services/orders/orders.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';

@Component({
  selector: 'app-create-sale-ticket',
  templateUrl: './create-sale-ticket.component.html',
  styleUrls: ['./create-sale-ticket.component.css']
})
export class CreateSaleTicketComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<CreateSaleTicketComponent>,
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
      note:'',
      number_table: '0'
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
        console.log('res',res);

        if (res.result) {
          this.order = res.data[0]
          console.log('this.order',this.order);

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
    var ficha = document.getElementById('ticket-data');
	  var ventimp = window.open(' ', 'popimpr');
	  ventimp.document.write( ficha.innerHTML );
    ventimp.document.documentElement.style.fontSize = '11px'
    ventimp.document.documentElement.style.fontFamily = 'Arial'
    ventimp.document.documentElement.style.wordBreak = 'break-all'
	  ventimp.document.close();
	  ventimp.print( );
	  ventimp.close();
  }

  close(){
    this.dialogRef.close()   
  }
  
}
