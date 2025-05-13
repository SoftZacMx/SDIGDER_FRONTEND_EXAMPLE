import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ISaource } from 'src/app/admin/interfaces/saources/saource.interface';
import { ISaourcesFilters } from 'src/app/admin/interfaces/saources/saources.filters.inerface';
import { SaourcesService } from 'src/app/admin/services/saources/saources.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import Swal from 'sweetalert2';
import { CreateSaourceComponent } from '../../saources/create-saource/create-saource.component';
import { EditSaourceComponent } from '../../saources/edit-saource/edit-saource.component';
import { IOrdersFilters } from 'src/app/admin/interfaces/orders/order.filters.interface';
import { IOrder } from 'src/app/admin/interfaces/orders/order.interface';
import * as moment from 'moment';
import { OrdersService } from 'src/app/admin/services/orders/orders.service';
import { SelectUserComponent } from '../../generic/select-user/select-user.component';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { SelectCashRegisterComponent } from '../../generic/select-cash-register/select-cash-register.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';
import { CreateOrderComponent } from '../create-order/create-order.component';
import { Router } from '@angular/router';
import { CreateSaleTicketComponent } from '../../sale-ticket/create-sale-ticket/create-sale-ticket.component';
import { PrintKitchenTicketComponent } from '../print-kitchen-ticket/print-kitchen-ticket.component';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css']
})
export class ListOrdersComponent {

  constructor(
    private dialog: MatDialog,
    private saourceService: SaourcesService,
    private orderService: OrdersService,
    private userDataService: UserDataService,
    private router:Router

  ) { }


  rol: string = this.userDataService.getUserData().rol!

  ngOnInit(): void {
    this.getTotalLenght()
    this.getOrders()
    console.log('rol',this.rol);
    
  }

  filters: IOrdersFilters = {
    status: '',
    pageIndex: 0,
    pageSize: 0,
    user: 0,
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    cash_register: 0,
    delivered: '',
    origin: ''
  }


  user: string = ''
  cash_register: string = ''


  saource_name: string = ''

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

  
  origin_options = [
    {
      value: 'Local',
      description: 'Local'
    },
    {
      value: 'Order',
      description: 'Pedidos'
    },
    {
      value: '',
      description: 'Todas'
    }
  ]

  orders: IOrder[] = []

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

    this.getOrders()
  }



  //GET ORDERS
  getOrders() {

    let filters = this.createFilters()

    this.orderService.getOrders(filters)
      .subscribe({

        next: (res: IResponse) => {

          console.log('getOrders next res', res);

          if (res.result) {
            this.orders = res.data
          }

        },
        error: (res: any) => {
          console.log('getOrders error res', res);
          this.orders = []
        }


      })
  }

  getTotalLenght() {

    let filters = this.createFilters()

    this.orderService.getOrders(filters)
      .subscribe({

        next: (res: IResponse) => {

          console.log('getTotalLenght next res', res);

          if (res.result) {
            this.length = res.data.length
          }

        },
        error: (res: any) => {
          console.log('getTotalLenght error res', res);
          this.length = 0



        }


      })
  }



  //SEARCH
  search() {
    this.getTotalLenght()
    this.getOrders()
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

      this.filters.user = data.id!
      this.user = `${data.name} ${data.last_name} ${data.second_last_name}`


    })
  }


  //Edit order
  editOrder(order_id:number): void {
    this.router.navigate(['/admin/point-of-sale/edit-order',order_id])
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

      this.filters.cash_register = data.id
      this.cash_register = `Caja ${data.id}`



    })
  }

  //DELETE SAOURCE
  deleteOrder(order_id: number) {

    Swal.fire({
      title: "¿Desea eliminar la orden?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.orderService.deleteOrder(order_id)
          .subscribe({

            next: (res: IResponse) => {

              console.log('deleteOrder next res', res);

              if (res.result) {
                fireSuccessDialog('Orden eliminado con éxito')

                this.filters.status = ''
                this.filters.pageIndex = 0
                this.filters.pageSize = 0

                this.getTotalLenght()
                this.getOrders()


              }

            },
            error: (res: any) => {

              console.log('deleteOrder error res', res);

              fireErrorDialog('Error al tratar de eliminar la orden')


            }
          })
      } else if (result.isDenied) {
      }
    });


  }

  createFilters(): IOrdersFilters {

    let filters: IOrdersFilters = {
      status: '',
      pageIndex: 0,
      pageSize: 0,
      user: 0,
      start_date: '',
      end_date: '',
      cash_register: 0,
      delivered: '',
      origin: ''
    }

    this.filters.status == '' ?
      null :
      filters.status = this.filters.status

    this.filters.delivered == '' ?
      null :
      filters.delivered = this.filters.delivered

    this.filters.user == 0 ?
      null :
      filters.user = this.filters.user

    this.filters.cash_register == 0 ?
      null :
      filters.cash_register = this.filters.cash_register

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

      
    this.filters.origin == '' ?
    null :
    filters.origin = this.filters.origin

    return filters
  }

  //CLEAN INPUTS FILTERS
  clean(key: string) {
    switch (key) {
      case 'user':
        this.filters.user = 0
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

  //OPEN VIEW ORDER DETAIL
  openDialogViewOrderDetail(enterAnimationDuration: string, exitAnimationDuration: string, order: IOrder, payOrder?: boolean): void {
    this.dialog.open(OrderDetailComponent, {
      data: {
        order: order,
        payOrder: payOrder
      },
      width: '550px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe(() => {
      
      this.getTotalLenght()
      this.getOrders()

    })
  }

  payOrder(order_id:number){
    this.router.navigate(['/admin/point-of-sale/pay-order',order_id])

  }

  //Deliver order
  deliver(order_id: number) {



    Swal.fire({
      title: "¿Desea entregar la orden?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.orderService.deliverOrder(order_id)
          .subscribe({


            next: (res: IResponse) => {

              console.log('deliverOrder next res', res)

              if (res.result) {
                fireSuccessDialog('Orden entregada con éxito')
                this.getTotalLenght()
                this.getOrders()
              }
            },

            error: (error: any) => {

              console.log('deliverOrder error error', error)

              if (error.error.error) {

                switch (error.error.message) {
                  case 'Order can´t be delivered':
                    fireSuccessDialog('Ocurrio un error al entregar la orden')
                    break;

                  default:
                    fireSuccessDialog('Ocurrio un error al tratar de entregar la orden')
                    break;
                }

              }



            }
          })

      } else if (result.isDenied) {
      }
    });

  }

  printTicket(order_id: number) {


    this.dialog.open(PrintKitchenTicketComponent, {
      data: {
        order_id: order_id
      },
      width: '500px',
      height: '700px',
      enterAnimationDuration: 500,
      exitAnimationDuration: 500,
      closeOnNavigation: false
    }).afterClosed().subscribe((data) => {

    })


  }


  generateSaleTickete(order_id: number) {

    this.dialog.open(CreateSaleTicketComponent, {
      data: {
        order_id: order_id
      },
      width: '500px',
      height: '700px',
      enterAnimationDuration: 500,
      exitAnimationDuration: 500,
      closeOnNavigation: false
    }).afterClosed().subscribe((data) => {

    })


  }



}

