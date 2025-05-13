import { Component } from '@angular/core';
import { SelectUserComponent } from '../../generic/select-user/select-user.component';
import { MatDialog } from '@angular/material/dialog';
import { SelectOpeningCashRegisterComponent } from '../../generic/select-opening-cash-register/select-opening-cash-register.component';
import * as moment from 'moment';
import { CashRegisterService } from 'src/app/admin/services/cash_register/cash-register.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { IClosingCashRegisterInterface } from 'src/app/admin/interfaces/cashs_register/closing_cash_register/closing_cash_register';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { OrderDetailComponent } from '../../orders/order-detail/order-detail.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-close-cash-register',
  templateUrl: './close-cash-register.component.html',
  styleUrls: ['./close-cash-register.component.css']
})
export class CloseCashRegisterComponent {

  constructor(
    private dialog: MatDialog,
    private cashRegistersService: CashRegisterService,
    private userDataService: UserDataService,
    private router: Router
  ) { }


  opening_cash_register: any = undefined
  date = moment().format('YYYY-MM-DD hh:mm:ss')
  close_cash_register_data: any = undefined
  cash_sales: any = []
  transfer_sales: any = []
  card_sales: any = []
  deffer_sales: any = []
  tips_sales: any = []


  //OPEN SELECT OPENING CASH REGISTER
  openDialogSelectOpeningCashRegitser(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SelectOpeningCashRegisterComponent, {
      data: {},
      width: '600px',
      height: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe((data) => {

      if (data == undefined) {
        return
      }

      this.opening_cash_register = data[0]

      this.getCloseCashRegisterInfo()

    })
  }

  getCloseCashRegisterInfo() {
    this.cashRegistersService.getOpeningCashRegistersOperations(this.opening_cash_register.id)
      .subscribe({
        next: (res: IResponse) => {
          console.log('getOpeningCashRegistersOperations next res', res);
          if (res.result) {
            this.close_cash_register_data = res.data

            this.cash_sales = this.close_cash_register_data.cash_payments.sales
            this.transfer_sales = this.close_cash_register_data.transfer_payments.sales
            this.card_sales = this.close_cash_register_data.card_payments.sales
            this.deffer_sales = this.close_cash_register_data.deffered_payments.sales
            this.tips_sales = this.close_cash_register_data.tips.sales

          }
        },
        error: (error: any) => {
          console.log('getOpeningCashRegistersOperations error res', error);
        }
      })
  }

  closeCashRegister() {



    let closing_cash_register: IClosingCashRegisterInterface = {
      date: moment().format('YYYY-MM-DD hh:mm:ss'),
      total_cash_payments: this.close_cash_register_data.cash_payments.cash_total,
      total_transfer_payments: this.close_cash_register_data.transfer_payments.transfer_total,
      total_iva: this.close_cash_register_data.transfer_payments.transfer_iva_total + this.close_cash_register_data.cash_payments.cash_iva_total,
      opening_cash_register_id: this.opening_cash_register.id,
      user_id: parseInt(this.userDataService.getUserData().id!),
      total_operations: this.close_cash_register_data.total_operations,
      total_card_payments: this.close_cash_register_data.card_payments.card_total,
      total_tips: this.close_cash_register_data.tips.total
    }



    this.cashRegistersService.closeCashRegister(closing_cash_register)
      .subscribe({
        next: (res: IResponse) => {
          console.log('closeCashRegister next res', res);
          if (res.result) {
            fireSuccessDialog('Caja cerrada con éxito')
            this.cleanData()

          }

        },
        error: (error: any) => {
          console.log('closeCashRegister error res', error);
          if (error.error.error) {
            fireErrorDialog('Algo salií mal al tratar de cerrar la caja')
          }
        }
      })




  }

  //OPEN VIEW ORDER DETAIL
  openDialogViewOrderDetail(enterAnimationDuration: string, exitAnimationDuration: string, order: any, payOrder?: boolean, viewFromClosingCashRegister?: boolean, viewDetailFromClosingCashRegisterAndIsAnDefferOrder?: boolean): void {
    this.dialog.open(OrderDetailComponent, {
      data: {
        order: order,
        payOrder: payOrder,
        viewDetailFromClosingCashRegister: viewFromClosingCashRegister,
        viewDetailFromClosingCashRegisterAndIsAnDefferOrder: viewDetailFromClosingCashRegisterAndIsAnDefferOrder
      },
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe(() => {

    })
  }

  cleanData(){
    this.opening_cash_register = undefined
    this.date = moment().format('YYYY-MM-DD hh:mm:ss')
    this.close_cash_register_data = undefined
    this.cash_sales = []
    this.transfer_sales = []
    this.card_sales = []
    this.deffer_sales = []
    this.tips_sales = []
  }

}
