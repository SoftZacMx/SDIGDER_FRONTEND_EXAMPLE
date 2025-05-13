import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { IEmployeeSalariePaymentInterface } from 'src/app/admin/interfaces/employees-salaries/employee-salarie-payment.interface';
import { IEmployeesSalariesFiltersInterface } from 'src/app/admin/interfaces/employees-salaries/employees-salaries-payments.filters.interface';
import { EmployeeSalariesPaymentsService } from 'src/app/admin/services/employees-salaries-payments/employee-salaries-payments.service';
import { CreateEmployeeSalariePaymentComponent } from '../create-employee-salarie-payment/create-employee-salarie-payment.component';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { SelectUserComponent } from '../../generic/select-user/select-user.component';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { EditEmployeeSalariePaymentComponent } from '../edit-employee-salarie-payment/edit-employee-salarie-payment.component';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';

@Component({
  selector: 'app-list-employee-salaries-payments',
  templateUrl: './list-employee-salaries-payments.component.html',
  styleUrls: ['./list-employee-salaries-payments.component.css']
})
export class ListEmployeeSalariesPaymentsComponent implements OnInit {

  constructor(
    private employeesSalariesPaymentsServices: EmployeeSalariesPaymentsService,
    private dialog: MatDialog,
    private userDataService:UserDataService
  ) { }

  ngOnInit(): void {
    this.getEmployeesSalariesPayments(true)
  }

  filters: IEmployeesSalariesFiltersInterface = {
    start_date: '',
    end_date: '',
    payment_method: 0,
    pageIndex: 0,
    pageSize: 0,
    user_id: 0
  }

  payments: IEmployeeSalariePaymentInterface[] = []
  user_name: string = ''
  user:string = ''
  rol:string = this.userDataService.getUserData().rol

  payment_methods_options = [
    {
      value: 1,
      description: 'Efectivo'
    },
    {
      value: 2,
      description: 'Transferencia'
    },
    {
      value: 0,
      description: 'Todos'
    }
  ]

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


    this.employeesSalariesPaymentsServices.getPayments(this.filters)
      .subscribe({
        next: (res: IResponse) => {
          console.log('handlePageEvent getPayments next res', res);
          if (res.result) {
            this.payments = res.data
          }
        },
        error: (error: any) => {
          console.log('handlePageEvent getPayments error error', error);
          if (error.error.error) {
            this.payments = []
          }
        }
      })



  }




  clean(key: string) {
    switch (key) {
      case 'start_date':
        this.filters.start_date = ''
        break;
      case 'end_date':
        this.filters.end_date = ''
        break;
      case 'user':
        this.filters.user_id = 0
        this.user = ''
        break;

      default:
        break;
    }
  }

  getEmployeesSalariesPayments(setLength?: boolean) {
    const filters = this.createFilters()
    this.employeesSalariesPaymentsServices.getPayments(filters)
      .subscribe({
        next: (res: IResponse) => {
          console.log('getPayments next res', res);
          if (res.result) {
            this.payments = res.data
            setLength == true ? this.length = res.data.length : null
          }
        },
        error: (error: any) => {
          console.log('getPayments error error', error);
          if (error.error.error) {
            this.payments = []
          }
        }
      })
  }


  search() {
    let filters = this.createFilters()
    filters.pageSize = 10
    filters.pageIndex = 0
    this.getEmployeesSalariesPayments(false)
  }



  //OPEN DIALOG EDIT EMPLOYEE SALARIE PAYMENT
  openDialogEditEmployeeSalarie(enterAnimationDuration: string, exitAnimationDuration: string, payment: IEmployeeSalariePaymentInterface): void {
    this.dialog.open(EditEmployeeSalariePaymentComponent, {
      data: {
        payment: payment
      },
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe(() => {
      this.getEmployeesSalariesPayments(true)
    })
  }


    //OPEN DIALOG CREATE EMPLOYEE SALARIE PAYMENT
    openDialogCreateEmployeeSalariePayment(enterAnimationDuration: string, exitAnimationDuration: string): void {
      this.dialog.open(CreateEmployeeSalariePaymentComponent, {
        data: {
          
        },
        width: '500px',
        height: '550px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.filters.end_date = ''
        this.filters.start_date = ''
        this.filters.pageIndex = 0
        this.filters.pageSize = 10
        this.filters.payment_method = 0
        this.filters.user_id =0

        this.getEmployeesSalariesPayments(true)
      })
    }

  //DELETE EMPLOYEE SALARIE PAYMENT
  deletePayment(payment_id: number) {

    Swal.fire({
      title: "¿Desea eliminar el pago?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        
        this.employeesSalariesPaymentsServices.deletePayment(payment_id)
          .subscribe({

            next: (res: IResponse) => {

              console.log('deletePayment next res', res);

              if (res.result) {
                fireSuccessDialog('Pago eliminado con éxito')

                this.filters.start_date = ''
                this.filters.end_date = ''
                this.filters.payment_method = 0
                this.filters.user_id = 0
                this.filters.pageIndex = 0
                this.filters.pageSize = 0

                this.getEmployeesSalariesPayments(true)


              }

            },
            error: (res: any) => {

              console.log('deletePayment error res', res);

              fireErrorDialog('Error al tratar de eliminar el pago')


            }
          })
          
      } else if (result.isDenied) {
      }
    });


  }


  createFilters(): IEmployeesSalariesFiltersInterface {

    const filters: IEmployeesSalariesFiltersInterface = {
      start_date: '',
      end_date: '',
      payment_method: 0,
      pageIndex: 0,
      pageSize: 0,
      user_id: 0
    }

    this.filters.start_date != '' ?
      filters.start_date = moment(this.filters.start_date).format('YYYY-MM-DD 00:00:00') :
      null

    this.filters.end_date != '' ?
      filters.end_date = moment(this.filters.end_date).format('YYYY-MM-DD 23:59:59') :
      null

    this.filters.payment_method != 0 ?
      filters.payment_method = this.filters.payment_method :
      null
    
      this.filters.user_id != 0 ?
        filters.user_id = this.filters.user_id :
        null

    return filters

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

      this.filters.user_id = data.id!
      this.user = `${data.name} ${data.last_name} ${data.second_last_name}`

      

    })
  }


}
