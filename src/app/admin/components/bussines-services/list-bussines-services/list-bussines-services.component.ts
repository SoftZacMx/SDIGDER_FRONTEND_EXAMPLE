import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { IBussinesServicesFiltersInterface } from 'src/app/admin/interfaces/bussines-services/busisnes-services.filters.interface';
import { IBussinesServicesInterface } from 'src/app/admin/interfaces/bussines-services/bussines-services.interface';
import { BussinesServicesService } from 'src/app/admin/services/bussines-services/bussines-services.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { OrderDetailComponent } from '../../orders/order-detail/order-detail.component';
import { EditBussinesServiceComponent } from '../edit-bussines-service/edit-bussines-service.component';
import Swal from 'sweetalert2';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { CreateBussinesServiceComponent } from '../create-bussines-service/create-bussines-service.component';
import { PayServiceComponent } from '../pay-service/pay-service.component';

@Component({
  selector: 'app-list-bussines-services',
  templateUrl: './list-bussines-services.component.html',
  styleUrls: ['./list-bussines-services.component.css']
})
export class ListBussinesServicesComponent implements OnInit{

    constructor(
      private bussinesServicesServices:BussinesServicesService,
      private dialog:MatDialog
    ){

    }

  ngOnInit(): void {
    this.getBussinesServices(true)
  }

    services:IBussinesServicesInterface[] = []
    service_name:string = ''

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
    filters:IBussinesServicesFiltersInterface = {
      start_date: '',
      end_date: '',
      pageSize: 0,
      pageIndex: 0,
      service: 0,
      status: '',
      periodicity: ''
    }

    status_options = [ 
      {
        value:'true',
        description:'Activo'
      },
      {
        value:'false',
        description:'Inactivo'
      },
      {
        value:'',
        description:'Todos'
      },
    ]

    periodicity_options = [ 
      {
        value:'1',
        description:'Mensual'
      },
      {
        value:'2',
        description:'Bimestral'
      },
      {
        value:'3',
        description:'Otro'
      },
      {
        value:'',
        description:'Todos'
      },
    ]
  
    pageEvent: PageEvent = new PageEvent;
    handlePageEvent(e: PageEvent) {
      this.pageEvent = e;
      this.pageSize = e.pageSize;
      this.pageIndex = e.pageIndex;
  
      this.filters.pageIndex = this.pageIndex
      this.filters.pageSize = this.pageSize


      this.bussinesServicesServices.getServices(this.filters)
      .subscribe({
        next: (res:IResponse) => {
          console.log('handlePageEvent getServices next res',res);
          if (res.result) {
            this.services = res.data
          }
        },
        error: (error:any) => {
          console.log('handlePageEvent getServices error error',error);
          if (error.error.error) {
            this.services = []
          }
        }
      })
        
  

    }

    getBussinesServices(setLength?:boolean){
      const filters = this.createFilters()
      this.bussinesServicesServices.getServices(filters)
        .subscribe({
          next: (res:IResponse) => {
            console.log('getServices next res',res);
            if (res.result) {
              this.services = res.data
              setLength == true ? this.length = res.data.length : null
            }
          },
          error: (error:any) => {
            console.log('getServices error error',error);
            if (error.error.error) {
              this.services = []
            }
          }
        })
    }


    createFilters():IBussinesServicesFiltersInterface{

      const filters:IBussinesServicesFiltersInterface  = {
        start_date: '',
        end_date: '',
        pageSize: 0,
        pageIndex: 0,
        service: 0,
        status: '',
        periodicity: ''
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
      
      this.filters.periodicity != '' ?
        filters.periodicity = this.filters.periodicity :
        null

      this.filters.status != '' ?
        filters.status = this.filters.status :
        null

        return filters

    }

    //OPEN EDIT SERVICE
    openDialogEditService(enterAnimationDuration: string, exitAnimationDuration: string , service:IBussinesServicesInterface): void {
      this.dialog.open(EditBussinesServiceComponent, {
        data: {
          service:service,
        },
        width: '500px',
        height: '550px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.getBussinesServices(true)
      })
    }

    //OPEN CREATE SERVICE
    openDialogCreateService(enterAnimationDuration: string, exitAnimationDuration: string): void {
      this.dialog.open(CreateBussinesServiceComponent, {
        data: {},
        width: '500px',
        height: '550px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.getBussinesServices(true)
      })
    }

    //OPEN PAY SERVICE DIALOG
    openDialogPayService(enterAnimationDuration: string, exitAnimationDuration: string,service:IBussinesServicesInterface): void {
      this.dialog.open(PayServiceComponent, {
        data: {
          service:service
        },
        width: '500px',
        height: '550px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.getBussinesServices(true)
      })
    }

    //DELETE SERVICE
    deleteService(service_id:number){

      Swal.fire({
        title: "¿Desea eliminar el servicio?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Si",
        denyButtonText: `No`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.bussinesServicesServices.deleteService(service_id)
          .subscribe({
  
            next: (res:IResponse) => {
  
              console.log('deleteService next res',res);
              
              if (res.result) {
                fireSuccessDialog('Servicio eliminado con éxito')
                
                this.filters.status = ''
                this.filters.pageIndex = 0
                this.filters.pageSize = 0

                this.getBussinesServices(true)


              }
    
            },
            error: (res:any) => {
  
              console.log('deleteService error res',res);
    
                  fireErrorDialog('Error al tratar de eliminar el servicio')
  
    
            }
          })
        } else if (result.isDenied) {
        }
      });


    }

    search(){
      let filters = this.createFilters()
      filters.pageIndex = 0
      filters.pageSize = 10
      this.getBussinesServices(true)

    }

    clean(key:string){
      switch (key) {
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

}
