 import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { ICashRegisterFiltersInterface } from 'src/app/admin/interfaces/cashs_register/cash-register.filters.interface';
import { ICashRegisterInterface } from 'src/app/admin/interfaces/cashs_register/cash-register.interface';
import { CashRegisterService } from 'src/app/admin/services/cash_register/cash-register.service';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { SelectUserComponent } from '../../generic/select-user/select-user.component';
import { CreateCashRegisterComponent } from '../create-cash-register/create-cash-register.component';
import { EditCashRegistersComponent } from '../edit-cash-registers/edit-cash-registers.component';
import Swal from 'sweetalert2';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';

@Component({
  selector: 'app-list-cash-registers',
  templateUrl: './list-cash-registers.component.html',
  styleUrls: ['./list-cash-registers.component.css']
})
export class ListCashRegistersComponent {

  constructor(

    private cashRegisterService:CashRegisterService,
    private dialog:MatDialog
    ){}
    

    ngOnInit(): void {
      this.getCashsRegister(true)
    }
  
    filters:ICashRegisterFiltersInterface = {
      status: '',
      pageSize: 10,
      pageIndex: 0,
      user: 0,
      start_date: '',
      end_date: ''
    }

    user:string = ''

  
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
  
    getCashsRegister(setLength?:boolean){
      let filters =  this.createFilters()
      this.cashRegisterService.getCashsRegister(filters)
        .subscribe({
  
          next:(res:IResponse) => {
            console.log('getCashsRegister next res',res);
            
            if (res.result) {
              
              this.cashsRegister = res.data

              if (setLength) {
                this.length = res.data.length
              }

            } 
          },
  
          error:(res:IResponse) => {
            console.log('getCashsRegister error res',res);
            this.cashsRegister = []
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
            this.cashsRegister = []
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
      this.filters.user != 0 ? filters.user =  this.filters.user : null

      return filters
    }

  //OPEN DIALOG CREATE CASH REGISTER
  openDialogCreateCashRegister(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CreateCashRegisterComponent, {
      data: {},
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
    }).afterClosed().subscribe(() => {
      this.getCashsRegister(true)
    })
  }
  
  //OPEN DIALOG EDIT CASH REGISTER
  openDialogEditCashRegister(enterAnimationDuration: string, exitAnimationDuration: string , cash_register:ICashRegisterInterface): void {
    this.dialog.open(EditCashRegistersComponent, {
      data: {
        cash_register:cash_register
      },
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
    }).afterClosed().subscribe(() => {
      this.getCashsRegister()
    })
  }

    //DELETE CASH REGISTER
    deleteOrder(cash_register_id:number){

      Swal.fire({
        title: "¿Desea eliminar la caja?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Si",
        denyButtonText: `No`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.cashRegisterService.deleteCashRegister(cash_register_id)
          .subscribe({
  
            next: (res:IResponse) => {
  
              console.log('deleteCashRegister next res',res);
              
              if (res.result) {

                fireSuccessDialog('Caja eliminado con éxito')
                
                this.filters.status = ''
                this.filters.pageIndex = 0
                this.filters.pageSize = 0

                this.getCashsRegister(true)


              }
    
            },
            error: (res:any) => {
  
              console.log('deleteCashRegister error res',res);
    
                  fireErrorDialog('Ocurrio un error al tratar de eliminar la caja')
  
    
            }
          })
        } else if (result.isDenied) {
        }
      });


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

  clean(key:string){
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

}


