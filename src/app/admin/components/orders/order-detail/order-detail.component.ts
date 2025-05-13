import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CashRegisterService } from 'src/app/admin/services/cash_register/cash-register.service';
import { SelectUserComponent } from '../../generic/select-user/select-user.component';
import { OrdersService } from 'src/app/admin/services/orders/orders.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { ISaource } from 'src/app/admin/interfaces/saources/saource.interface';
import { IOrder } from 'src/app/admin/interfaces/orders/order.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { IPaymentsDifferentiation } from 'src/app/admin/interfaces/payments_differentiation/payment_differentiation.interface';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {



  constructor(
    public dialogRef: MatDialogRef<OrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrdersService,
    private formBuilder: FormBuilder
  ) { }




  ngOnInit(): void {
    this.order = this.data.order
    this.payOrder = this.data.payOrder
    this.getSaourcesOrder()
    this.getPaymentDifferentiation()



  }

  saources: any[] = []
  payments_differntiations: IPaymentsDifferentiation[] = []

  order!: IOrder
  payOrder: boolean = false
  payed = this.formBuilder.control(0, [Validators.required, Validators.min(this.data.order.total)])
  change = this.formBuilder.control(0)


  close() {
    this.dialogRef.close()
  }

  getSaourcesOrder() {

    //Evaluate if we are getting the order detail from closing cash register module  or from list order module 
    let order_id = 0
    this.data.viewDetailFromClosingCashRegister == true ?
      order_id = this.data.order.order_id :
      order_id = this.data.order.id


    this.orderService.getSaourcesOrder(order_id)
      .subscribe({
        next: (res: IResponse) => {

          console.log('getOrder next res', res);

          if (res.result) {
            this.saources = res.data
          }

        },
        error: (res: IResponse) => {

          console.log('getOrder error res', res);

        }
      })
  }

  getPaymentDifferentiation() {    

    let order_id  = 0
    this.data.viewDetailFromClosingCashRegisterAndIsAnDefferOrder == true ?
      order_id = this.data.order.order_id :
      order_id = this.data.order.id

    this.orderService.getPaymentsDifferentiations(order_id)
      .subscribe({
        next: (res: IResponse) => {

          console.log('getPaymentsDifferentiations next res', res);

          if (res.result) {

            console.log('res getPaymentsDifferentiations res', res);

            this.payments_differntiations = res.data
          }

        },
        error: (error: any) => {

          console.log('getOrder error error', error);

        }
      })
  }







}
