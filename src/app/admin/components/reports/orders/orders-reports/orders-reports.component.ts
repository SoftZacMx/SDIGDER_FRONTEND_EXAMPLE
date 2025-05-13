import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { IOrdersFilters } from 'src/app/admin/interfaces/orders/order.filters.interface';
import { IOrder } from 'src/app/admin/interfaces/orders/order.interface';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { OrdersService } from 'src/app/admin/services/orders/orders.service';
import { SaourcesService } from 'src/app/admin/services/saources/saources.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';
import Swal from 'sweetalert2';
import { SelectCashRegisterComponent } from '../../../generic/select-cash-register/select-cash-register.component';
import { SelectUserComponent } from '../../../generic/select-user/select-user.component';
import { OrderDetailComponent } from '../../../orders/order-detail/order-detail.component';
import { IOrdersReportFilters } from 'src/app/admin/interfaces/reports/orders/order_rerport.filters';
import { OrdersReportsService } from 'src/app/admin/services/reports/orders/orders-reports.service';
import { ExportSalesReportService } from 'src/app/admin/services/export/reports/sales/export-sales-report.service';

@Component({
  selector: 'app-orders-reports',
  templateUrl: './orders-reports.component.html',
  styleUrls: ['./orders-reports.component.css']
})
export class OrdersReportsComponent {

  constructor(
    private dialog: MatDialog,
    private ordersReportsService: OrdersReportsService,
    private userDataService: UserDataService,
    private exportSalesReportService:ExportSalesReportService
  ) { }


  rol: string = this.userDataService.getUserData().rol!

  ngOnInit(): void {

    this.getTotalLength()

    this.filters.pageSize = 10
    this.getOrders()

  }

  filters: IOrdersReportFilters = {
    pageIndex: 0,
    pageSize: 0,
    start_date: '',
    end_date: '' ,
    report_type: 1,
    format: ''
  }


  user: string = ''
  cash_register: string = ''


  saource_name: string = ''


  report_types_options = [

    {
      value: 1,
      description: 'Ventas agrupadas por platillo'
    },
  ]

  format_options = [
    {
      value: '',
      description: 'Sin Formato',
    },
    {
      value: 'PDF',
      description: 'PDF'
    },
    {
      value: 'XLSX',
      description: 'Hoja De Cácluco'
    },
  ]

  status_options = [
    {
      value: 'true',
      description: 'Pgada'
    },
    {
      value: 'false',
      description: 'Pendiente'
    },
    {
      value: '',
      description: 'Todas'
    }
  ]

  deliver_status_options = [
    {
      value: 'true',
      description: 'Enregadas'
    },
    {
      value: 'false',
      description: 'Pendientes'
    },
    {
      value: '',
      description: 'Todas'
    }
  ]

  data: any [] = []

  total_sold: number = 0
  total_porcentage: number = 0

  //PAGINATOR
  pageSizeOptions = [2, 5, 10, 25];
  length = 0
  pageSize = 10;
  pageIndex = 0;

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent = new PageEvent;
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.filters.pageIndex = this.pageIndex
    this.filters.pageSize = this.pageSize

    this.ordersReportsService.getOrdersReport(this.filters)
      .subscribe({

        next: (res: IResponse) => {

          console.log('handlePageEvent getOrders next res', res);

          if (res.result) {
            this.data = res.data.sales
            this.total_porcentage = res.data.total_porcentage
            this.total_sold = res.data.total_sold
          }

        },
        error: (res: any) => {
          console.log(' handlePageEvent getOrders error res', res);



        }


      })
  }



  //GET ORDERS
  getOrders(changeLength?: boolean) {

    let filters = this.createFilters()

    this.ordersReportsService.getOrdersReport(filters)
      .subscribe({

        next: (res: IResponse) => {

          console.log('getOrders next res', res);

          if (res.result) {
            this.data = res.data.sales
            changeLength == true ? this.length = res.data.sales.length : null
            this.total_porcentage = res.data.total_porcentage
            this.total_sold = res.data.total_sold
          }else{
            this.data = []

          }

        },
        error: (res: any) => {
          console.log('getOrders error res', res);
          this.data = []




        }


      })
  }


  //Get total length
  getTotalLength() {

    let filters = this.createFilters()

    this.ordersReportsService.getOrdersReport(filters)
      .subscribe({

        next: (res: IResponse) => {

          console.log('getTotalLength next res', res);

          if (res.result) {
            this.data = res.data.sales
            this.length = res.data.sales.length 
          }

        },
        error: (res: any) => {
          console.log('getTotalLength error res', res);
          this.data = []




        }


      })
  }


  //SEARCH
  search() {
    let changeLength = true
    this.getOrders(changeLength)
  }

  //OPEN SELECT USER
  openDialogSelectUser(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SelectUserComponent, {
      data: {},
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe((data: IUser) => {


      if (data == null) {
        return
      }

      this.user = `${data.name} ${data.last_name} ${data.second_last_name}`


    })
  }

  //OPEN SELECT CASH REGISTER
  openDialogSelectCashRegister(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SelectCashRegisterComponent, {
      data: {},
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe((data) => {

      if (data == undefined) {
        return
      }

      this.cash_register = `Caja ${data.id}`



    })
  }

  createFilters(): IOrdersReportFilters {

    let filters: IOrdersReportFilters = {
      pageIndex: 0,
      pageSize: 0,
      start_date: '',
      end_date: '',
      report_type: 0,
      format: ''
    }

    this.filters.start_date == '' ?
      null :
      filters.start_date = moment(this.filters.start_date).format('YYYY-MM-DD 00:00:00')

    this.filters.end_date == '' ?
      null :
      filters.end_date = moment(this.filters.end_date).format('YYYY-MM-DD 23:59:59')

    this.filters.pageIndex == 0 ?
      null :
      filters.pageIndex = this.filters.pageIndex

    this.filters.pageSize == 0 ?
      null :
      filters.pageSize = this.filters.pageSize

    this.filters.format == '' ?
      null :
      filters.format = this.filters.format

    return filters
  }

  //CLEAN INPUTS FILTERS
  clean(key: string) {
    switch (key) {
      case 'user':
        this.user = ''
        break;
      case 'start_date':
        this.filters.start_date = ''
        break;
      case 'end_date':
        this.filters.end_date = ''
        break;
      default:
        break;
    }
  }


  //Export the report
  export(){
    let filters = this.createFilters()
    filters.pageIndex = 0 
    filters.pageSize = 0
    this.exportSalesReportService.exportPdfOrdersGroupedBySaource(filters);
  }






}
