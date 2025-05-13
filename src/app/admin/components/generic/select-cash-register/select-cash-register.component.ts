import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { IUsersFilters } from 'src/app/admin/interfaces/users/users.filters.interface';
import { UsersService } from 'src/app/admin/services/users/users.service';
import { fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { SelectUserComponent } from '../select-user/select-user.component';
import { CashRegisterService } from 'src/app/admin/services/cash_register/cash-register.service';
import { ICashRegisterInterface } from 'src/app/admin/interfaces/cashs_register/cash-register.interface';
import { ICashRegisterFiltersInterface } from 'src/app/admin/interfaces/cashs_register/cash-register.filters.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-select-cash-register',
  templateUrl: './select-cash-register.component.html',
  styleUrls: ['./select-cash-register.component.css']
})
export class SelectCashRegisterComponent {
  constructor(
    public dialogRef: MatDialogRef<SelectUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cashRegisterService:CashRegisterService
    ){}
    

    ngOnInit(): void {
      this.getCashsRegister()
    }
  
    filters:ICashRegisterFiltersInterface = {
      status: '',
      pageSize: 10,
      pageIndex: 0,
      user: 0,
      start_date: '',
      end_date: ''
    }
  
    status_options = [ 
      {
        description:'Activo',
        value:'true'
      },
      {
        description:'Inactivo',
        value:'false'
      },
      {
        description:'Todos',
        value:''
      }
    ]
  
    cashsRegister:ICashRegisterInterface[] = []
  
    user_name:string = ''

    cash_register_selected:unknown =  undefined



  
  
    //PAGINATOR
    length = 0;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [2,5, 10, 25];
    pageEvent: PageEvent = new PageEvent;
  
    handlePageEvent(e: PageEvent) {
  
  
      this.pageEvent = e;
      this.pageSize = e.pageSize;
      this.pageIndex = e.pageIndex;
  
      this.filters.pageIndex = this.pageIndex
      this.filters.pageSize = this.pageSize
      
  
      this.cashRegisterService.getCashsRegister(this.filters)
        .subscribe({
          next:(res:IResponse) => {
  
            console.log('handlePageEvent getCashsRegister next res',res);
  
            if(res.result){
              this.cashsRegister = res.data
            }
          },
          error:(res:any)=>{
  
            console.log('handlePageEvent getCashsRegister error',res);
            
            
          }
        })
  
        /*
  
        */
  
  
    }
  
    getCashsRegister(){
      let filters =  this.createFilters()
      this.cashRegisterService.getCashsRegister(filters)
        .subscribe({
  
          next:(res:IResponse) => {
            console.log('getCashsRegister next res',res);
            
            if (res.result) {
              this.cashsRegister = res.data
              this.length = res.data.length
            } 
          },
  
          error:(res:IResponse) => {
            console.log('getCashsRegister error res',res);
            
            fireErrorDialog('Algo salío mal al tratar de obtener las cajas')
          }
        })
    }
  
    search(){
  
      
      let filters =  this.createFilters()
      filters.pageIndex = 0
      this.cashRegisterService.getCashsRegister(filters)
        .subscribe({
  
          next:(res:IResponse) => {
            console.log('getCashsRegister next res',res);
            
            if (res.result) {
              this.cashsRegister = res.data
              this.length = res.data.length
            } 
          },
  
          error:(res:IResponse) => {
            console.log('getCashsRegister error res',res);
            
            fireErrorDialog('Algo salío mal al tratar de obtener las cajas')
          }
        })
    }
  
    createFilters():ICashRegisterFiltersInterface{
  
      let filters:ICashRegisterFiltersInterface = {
        status: '',
        pageSize: 0,
        pageIndex: 0,
        user: 0,
        start_date: '',
        end_date: ''
      }
  
      this.filters.status != '' ? filters.status =  this.filters.status : null
      this.filters.pageSize != 0 ? filters.pageSize =  this.filters.pageSize : null
      this.filters.pageIndex != 0 ? filters.pageIndex =  this.filters.pageSize : null
      this.filters.start_date != '' ? filters.start_date = moment(this.filters.start_date).format('YYYY-MM-DD 00:00:00') : null
      this.filters.end_date != '' ? filters.end_date = moment(this.filters.end_date).format('YYYY-MM-DD 23:59:59') : null

      return filters
    }


    close(){
      this.dialogRef.close(this.cash_register_selected)
    }


    saveSelection(list:MatSelectionList){

      
      this.cash_register_selected = list._value![0]
      this.close()
    }


}
