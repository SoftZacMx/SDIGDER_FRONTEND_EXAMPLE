import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { IBussinesServicesFiltersInterface } from 'src/app/admin/interfaces/bussines-services/busisnes-services.filters.interface';
import { IBussinesServicesInterface } from 'src/app/admin/interfaces/bussines-services/bussines-services.interface';
import { BussinesServicesService } from 'src/app/admin/services/bussines-services/bussines-services.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import Swal from 'sweetalert2';
import { CreateBussinesServiceComponent } from '../create-bussines-service/create-bussines-service.component';
import { EditBussinesServiceComponent } from '../edit-bussines-service/edit-bussines-service.component';
import { PayServiceComponent } from '../pay-service/pay-service.component';
import { IBussinesServicesPaymentInterface } from 'src/app/admin/interfaces/bussines-services_payments/bussines-services-payments.interface';
import { IBussinesServicesPaymentsFiltersInterface } from 'src/app/admin/interfaces/bussines-services_payments/busisnes-services-payments.filters.interface';
import { BussinesServicesPaymentsService } from 'src/app/admin/services/bussines-services-payments/bussines-services-payments.service';
import { SelectServiceComponent } from '../../generic/select-service/select-service.component';
@Component({
  selector: 'app-list-payments-services',
  templateUrl: './list-payments-services.component.html',
  styleUrls: ['./list-payments-services.component.css']
})
export class ListPaymentsServicesComponent {

  constructor(
    private bussinesServicesServicesPayments: BussinesServicesPaymentsService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.getBussinesServicesPayments(true)
  }

  services_payments: IBussinesServicesPaymentInterface[] = []
  service_name: string = ''
  service: string = ''

  //PAGINATOR
  pageSizeOptions = [2, 5, 10, 25];
  length = 0
  pageSize = 10;
  pageIndex = 0;

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  //Filters
  filters: IBussinesServicesPaymentsFiltersInterface = {
    start_date: '',
    end_date: '',
    pageSize: 0,
    pageIndex: 0,
    service: 0,
  }

  status_options = [
    {
      value: 'true',
      description: 'Activo'
    },
    {
      value: 'false',
      description: 'Inactivo'
    },
    {
      value: '',
      description: 'Todos'
    },
  ]

  periodicity_options = [
    {
      value: '1',
      description: 'Mensual'
    },
    {
      value: '2',
      description: 'Bimestral'
    },
    {
      value: '3',
      description: 'Otro'
    },
    {
      value: '',
      description: 'Todos'
    },
  ]

  pageEvent: PageEvent = new PageEvent;
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.filters.pageIndex = this.pageIndex
    this.filters.pageSize = this.pageSize


    this.bussinesServicesServicesPayments.getPaymentsServices(this.filters)
      .subscribe({
        next: (res: IResponse) => {
          console.log('handlePageEvent getServices next res', res);
          if (res.result) {
            this.services_payments = res.data
          }
        },
        error: (error: any) => {
          console.log('handlePageEvent getServices error error', error);
          if (error.error.error) {
            this.services_payments = []
          }
        }
      })



  }

  getBussinesServicesPayments(setLength?: boolean) {
    const filters = this.createFilters()
    this.bussinesServicesServicesPayments.getPaymentsServices(filters)
      .subscribe({
        next: (res: IResponse) => {
          console.log('getServices next res', res);
          if (res.result) {
            this.services_payments = res.data
            setLength == true ? this.length = res.data.length : null
          }
        },
        error: (error: any) => {
          console.log('getServices error error', error);
          if (error.error.error) {
            this.services_payments = []
          }
        }
      })
  }


  createFilters(): IBussinesServicesPaymentsFiltersInterface {

    const filters: IBussinesServicesPaymentsFiltersInterface = {
      start_date: '',
      end_date: '',
      pageSize: 0,
      pageIndex: 0,
      service: 0,
    }

    this.filters.start_date != '' ?
      filters.start_date = moment(this.filters.start_date).format('YYYY-MM-DD 00:00:00') :
      null

    this.filters.end_date != '' ?
      filters.end_date = moment(this.filters.end_date).format('YYYY-MM-DD 23:59:59') :
      null

    this.filters.service != 0 ?
      filters.service = this.filters.service :
      null


    return filters

  }


  //OPEN PAY SERVICE DIALOG
  openDialogPayService(enterAnimationDuration: string, exitAnimationDuration: string, service?: IBussinesServicesInterface): void {
    this.dialog.open(PayServiceComponent, {
      data: {
        service: service
      },
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe(() => {
      this.getBussinesServicesPayments(true)
    })
  }

  //DELETE SERVICE
  deleteService(payment_id: number) {

    Swal.fire({
      title: "¿Desea eliminar el pago del servicio?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.bussinesServicesServicesPayments.deletePaymentService(payment_id)
          .subscribe({

            next: (res: IResponse) => {

              console.log('deletePaymentService next res', res);

              if (res.result) {
                fireSuccessDialog('Pago eliminado con éxito')

                this.filters.pageIndex = 0
                this.filters.pageSize = 0

                this.getBussinesServicesPayments(true)


              }

            },
            error: (res: any) => {

              console.log('deletePaymentService error res', res);

              fireErrorDialog('Error al tratar de eliminar el pago')


            }
          })
      } else if (result.isDenied) {
      }
    });


  }

  search() {
    let filters = this.createFilters()
    filters.pageIndex = 0
    filters.pageSize = 10
    this.getBussinesServicesPayments(true)

  }

  clean(key: string) {
    switch (key) {
      case 'start_date':
        this.filters.start_date = ''
        break;
      case 'end_date':
        this.filters.end_date = ''
        break;
      case 'service':
        this.filters.service = 0
        this.service = ''
        break;


      default:
        break;
    }
  }

  //OPEN DIALOG SELECT SERVICE
  openDialogSelectService(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SelectServiceComponent, {
      data: {},
      width: '600px',
      height: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe((data: any) => {

      if (data == undefined) {
        this.dialog.closeAll()
        return
      }



      this.service = data[0].name
      this.filters.service = data[0].id



    })
  }
}
