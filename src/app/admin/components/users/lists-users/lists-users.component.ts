import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { IUsersFilters } from 'src/app/admin/interfaces/users/users.filters.interface';
import { UsersService } from 'src/app/admin/services/users/users.service';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserComponent } from '../create-user/create-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lists-users',
  templateUrl: './lists-users.component.html',
  styleUrls: ['./lists-users.component.css']
})


export class ListsUsersComponent implements OnInit {

  constructor(
    private userServices:UsersService,
    public dialog: MatDialog,

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

  roles = [
    {
      description:'Administrador',
      value:'Administrator'
    },
    {
      description:'Mesero',
      value:'Waiter'
    },
    {
      description:'Gerente',
      value:'Manager'
    },
    {
      description:'Todos',
      value:''
    }
  ]

  users:IUser[] = []

  user_name:string = ''


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

        error:(error:any) => {
          console.log('getUser error error',error);

          if (error.error.error) {
            switch (error.message) {
              case 'Users can´t be found':
                this.users = []
                break;
            
              default:
                fireErrorDialog('Algo salío mal al tratar de obtener los usuarios')
                break;
            }
          }
          
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
    this.filters.rol != '' ? filters.rol =  this.filters.rol : null
    this.filters.pageSize != 0 ? filters.pageSize =  this.filters.pageSize : null
    this.filters.pageIndex != 0 ? filters.pageIndex =  this.filters.pageSize : null

    return filters
  }

  deleteUser(user_id:number){


    Swal.fire({
      title: '¿Desea elimnar el usuario?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        //Delete the user
        this.userServices.deleteUser(user_id)
          .subscribe({
            next:(res:IResponse) => {
              if(res.result){
                console.log('deleteUser next res',res);
                
                fireSuccessDialog('Usuario eliminado con éxito')
                this.getUsers()
              }
            },

            error:(res:any) => {

              console.log('deleteUser error res',res);


            }
          })

      } else if (result.isDenied) {
      }
    
    });




  }


  //OPEN DIALOG CREATE USER
  openDialogCreateUser(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CreateUserComponent, {
      data: {},
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
    }).afterClosed().subscribe(() => {
      this.getUsers()
    })
  }

  //OPEN DIALOG EDIT USER
  openDialogEditUser(enterAnimationDuration: string, exitAnimationDuration: string,user:IUser): void {
    this.dialog.open(EditUserComponent, {
      data: {
        user:user
      },
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
    }).afterClosed().subscribe(() => {
      this.getUsers()
    })
  }




}
