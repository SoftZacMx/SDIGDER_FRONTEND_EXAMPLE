import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CreateBussinesServiceComponent } from '../../bussines-services/create-bussines-service/create-bussines-service.component';
import { BussinesServicesPaymentsService } from 'src/app/admin/services/bussines-services-payments/bussines-services-payments.service';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { IBussinesServicesInterface } from 'src/app/admin/interfaces/bussines-services/bussines-services.interface';
import { IBussinesServicesFiltersInterface } from 'src/app/admin/interfaces/bussines-services/busisnes-services.filters.interface';
import { BussinesServicesService } from 'src/app/admin/services/bussines-services/bussines-services.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-select-service',
  templateUrl: './select-service.component.html',
  styleUrls: ['./select-service.component.css']
})
export class SelectServiceComponent implements OnInit{

  constructor(
    private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<SelectServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bussinesServicesServices:BussinesServicesService,
    private userDataService:UserDataService
    ){}

  ngOnInit(): void {
    this.getBussinesServices(true)
  }

    saveSelections(selectionList:MatSelectionList){

      this.dialogRef.close(selectionList._value)
      

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
