import { Component, Inject, OnInit } from '@angular/core';
import { SelectUserComponent } from '../select-user/select-user.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { PageEvent } from '@angular/material/paginator';
import { IOpeningCashRegistersFilters } from 'src/app/admin/interfaces/cashs_register/opening-cash-registers.filters.interface';
import * as moment from 'moment';
import { CashRegisterService } from 'src/app/admin/services/cash_register/cash-register.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { MatList, MatSelectionList } from '@angular/material/list';
import { SelectSaourceComponent } from '../select-saource/select-saource.component';

@Component({
  selector: 'app-select-opening-cash-register',
  templateUrl: './select-opening-cash-register.component.html',
  styleUrls: ['./select-opening-cash-register.component.css']
})
export class SelectOpeningCashRegisterComponent implements OnInit {

    user:string = ''
    user_name:string = ''

    filters:IOpeningCashRegistersFilters = {
      start_date: '',
      end_date: '',
      pageIndex: 0,
      pageSize: 0,
      user: 0
    }


    opening_cash_regisers:any = []

      constructor(
        private dialog:MatDialog,
        public dialogRef: MatDialogRef<SelectOpeningCashRegisterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cashRegisterServices:CashRegisterService
      ){}


  ngOnInit(): void {
    this.getOpeningCashRegisters(true)
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
        }).afterClosed().subscribe((data:IUser) => {
  
          
          if (data == null) {
            return
          }
  
          //this.filters.user = data.id!
          this.user = `${data.name} ${data.last_name} ${data.second_last_name}`
  
  
        })
      }

          //CLEAN INPUTS FILTERS
    clean(key:string){
      switch (key) {
        case 'user':
          //this.filters.user = 0
          this.user = ''
          break;
        case 'start_date':
            //this.filters.start_date = ''
            break;
        case 'end_date':
            //this.filters.end_date = ''
            break;
        default:
          break;
      }
    }


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
         

         this.cashRegisterServices.getOpeningCashRegisters(this.filters)
         .subscribe({

           next: (res:IResponse) => {
             console.log('handlePageEvent getOpeningCashRegisters next res',res);
             if (res.result) {
               this.opening_cash_regisers = res.data
             }
             
           },
           error: (error:any) => {
             console.log('handlePageEvent getOpeningCashRegisters error res',error);

             if (error.error.error) {

             }
             
           }


         })
     
     
       }

       close(){
        this.dialog.closeAll()
       }


       getOpeningCashRegisters(setLength?:boolean){

        const filters = this.createFilters()

        this.cashRegisterServices.getOpeningCashRegisters(filters)
          .subscribe({

            next: (res:IResponse) => {
              console.log('getOpeningCashRegisters next res',res);
              if (res.result) {
                this.opening_cash_regisers = res.data
                setLength ? this.length = res.data.length : null
              }
              
            },
            error: (error:any) => {
              console.log('getOpeningCashRegisters error res',error);

              if (error.error.error) {
                this.opening_cash_regisers = []
              }
              
            }


          })


       }

       createFilters():IOpeningCashRegistersFilters{
        let filter:IOpeningCashRegistersFilters = {
          start_date: '',
          end_date: '',
          pageIndex: 0,
          pageSize: 0,
          user: 0
        }

        this.filters.start_date == '' ? 
          null : 
          filter.start_date = moment(this.filters.start_date).format('YYYY-MM-DD 00:00:00')

          this.filters.end_date == '' ? 
          null : 
          filter.end_date = moment(this.filters.start_date).format('YYYY-MM-DD 23:59:59')
        
        this.filters.user == 0 ? 
          null : 
          filter.user = this.filters.user

        this.filters.pageIndex == 0 ? 
          null : 
          filter.pageIndex = this.filters.pageIndex
        
        this.filters.pageSize == 0 ? 
          null : 
          filter.pageSize = this.filters.pageSize 

        return filter        
       }


       saveSelection(item:MatSelectionList){
        this.dialogRef.close(item._value)
       }


}
