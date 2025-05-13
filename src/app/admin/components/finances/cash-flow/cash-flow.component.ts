import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IBussinesServicesPaymentInterface } from 'src/app/admin/interfaces/bussines-services_payments/bussines-services-payments.interface';
import { IOrdersFilters } from 'src/app/admin/interfaces/orders/order.filters.interface';
import { IOrder } from 'src/app/admin/interfaces/orders/order.interface';
import { IFiltersReports } from 'src/app/admin/interfaces/reports/report.filters.interface';
import { OrdersService } from 'src/app/admin/services/orders/orders.service';
import { FlowCashService } from 'src/app/admin/services/reports/flow_cash/flow-cash.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.css']
})
export class CashFlowComponent implements OnInit{

  filters: IFiltersReports = {
    start_date: moment().subtract(1,'month').toISOString() ,
    end_date: moment().toISOString()
  };

  orders:IOrder[] = []
  bussines_services_payments:IBussinesServicesPaymentInterface[] = []
  merchandises_purchases:any[] = []
  employee_salaries_payments:any[] = []
  tips:any[] = []

  cash_flow:any = {
    balance: '',
    total: 0
  }

  total_incomes:number = 0
  total_bussines_services_payments:number = 0
  total_merchandise_purchases:number = 0
  total_employee_salaries_payments:number = 0
  total_expenses:number = 0
  total_tips:number = 0

  constructor(
    private flowCashService:FlowCashService,
    private ordersService:OrdersService
  ){

  }

  ngOnInit(): void {
    



    this.getCashFlowReport()

  }

  getCashFlowReport(){
    let filters = this.createFilters()

    this.flowCashService.getFlowCashReport(filters)
      .subscribe({
        next: (res:IResponse) => {
          console.log('getFlowCashReport next res',res);
          
          if (res.result) {
            this.bussines_services_payments = res.data.expenses.bussinesServicePayments.bussinesServicePayments
            this.total_bussines_services_payments = res.data.expenses.bussinesServicePayments.total_bussines_services_payments

            this.merchandises_purchases = res.data.expenses.purchase_merchandises.purchase_merchandises
            this.total_merchandise_purchases = res.data.expenses.purchase_merchandises.total_purchase_merchandises

            this.employee_salaries_payments = res.data.expenses.employeeSalariesPayments.employeeSalariesPayments
            this.total_employee_salaries_payments = res.data.expenses.employeeSalariesPayments.total_employees_salaries_payments

            this.orders = res.data.incomes.orders
            this.cash_flow =  res.data.cash_flow

            this.total_incomes =  res.data.incomes.total_incomes
            this.total_expenses = res.data.expenses.total_expenses

            this.tips = res.data.expenses.tips.orders
            this.total_tips = res.data.expenses.tips.total_tips
          }
        },
        error: (error:any) => {
          console.log('getFlowCashReport error res',error);
          
          if (error.error.error) {
            
          }
        }
      })
  }


  createFilters():IFiltersReports{    

    let filters:IFiltersReports = {
      start_date: '',
      end_date: ''
    }

    this.filters.start_date == '' ? 
      null : filters.start_date = moment(this.filters.start_date).format('YYYY-MM-DD 00:00:00')
    
    this.filters.end_date == '' ? 
      null : filters.end_date = moment(this.filters.end_date).format('YYYY-MM-DD 23:59:59')



    return filters
  }

  search(){
    this.getCashFlowReport()
  }







}
