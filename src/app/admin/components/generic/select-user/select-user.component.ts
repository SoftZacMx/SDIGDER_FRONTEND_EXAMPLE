import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ISaource } from 'src/app/admin/interfaces/saources/saource.interface';
import { SaourcesService } from 'src/app/admin/services/saources/saources.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { CreateSaourceComponent } from '../../saources/create-saource/create-saource.component';
import { UsersService } from 'src/app/admin/services/users/users.service';
import { PageEvent } from '@angular/material/paginator';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { IUsersFilters } from 'src/app/admin/interfaces/users/users.filters.interface';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.css']
})
export class SelectUserComponent {

  constructor(
    public dialogRef: MatDialogRef<SelectUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userServices:UsersService
    ){}
    

    ngOnInit(): void {
      this.getUsers()
    }
  
    filters:IUsersFilters = {
      status: '',
      pageSize: 10,
      pageIndex: 0,
      rol: ''
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
  
    users:IUser[] = []
  
    user_name:string = ''

    user_selected:unknown =  undefined



  
  
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
      
  
      this.userServices.getUsers(this.filters)
        .subscribe({
          next:(res:IResponse) => {
  
            console.log('handlePageEvent getUsers next res',res);
  
            if(res.result){
              this.users = res.data
            }
          },
          error:(res:any)=>{
  
            console.log('handlePageEvent getUsers error',res);
            
            
          }
        })
  
        /*
  
        */
  
  
    }
  
    getUsers(){
      let filters =  this.createFilters()
      this.userServices.getUsers(filters)
        .subscribe({
  
          next:(res:IResponse) => {
            console.log('getUser next res',res);
            
            if (res.result) {
              this.users = res.data
              this.length = res.data.length
            } 
          },
  
          error:(res:IResponse) => {
            console.log('getUser error res',res);
            
            fireErrorDialog('Algo salío mal al tratar de obtener los usuarios')
          }
        })
    }
  
    search(){
  
      
      let filters =  this.createFilters()
      filters.pageIndex = 0
      this.userServices.getUsers(filters)
        .subscribe({
  
          next:(res:IResponse) => {
            console.log('getUser next res',res);
            
            if (res.result) {
              this.users = res.data
              this.length = res.data.length
            } 
          },
  
          error:(res:IResponse) => {
            console.log('getUser error res',res);
            
            fireErrorDialog('Algo salío mal al tratar de obtener los usuarios')
          }
        })
    }
  
    createFilters():IUsersFilters{
  
      let filters:IUsersFilters = {
        status: '',
        pageSize: 0,
        pageIndex: 0,
        rol: ''
      }
  
      this.filters.status != '' ? filters.status =  this.filters.status : null
      this.filters.pageSize != 0 ? filters.pageSize =  this.filters.pageSize : null
      this.filters.pageIndex != 0 ? filters.pageIndex =  this.filters.pageSize : null
  
      return filters
    }


    close(){
      this.dialogRef.close(this.user_selected)
    }


    saveUserSelected(list:MatSelectionList){
      this.user_selected = list._value![0]
      this.close()
    }



}
