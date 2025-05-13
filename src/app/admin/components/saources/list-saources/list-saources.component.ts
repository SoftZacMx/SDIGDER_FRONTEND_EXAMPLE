import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateSaourceComponent } from '../create-saource/create-saource.component';
import { ISaourcesFilters } from 'src/app/admin/interfaces/saources/saources.filters.inerface';
import { PageEvent } from '@angular/material/paginator';
import { SaourcesService } from 'src/app/admin/services/saources/saources.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { ISaource } from 'src/app/admin/interfaces/saources/saource.interface';
import { EditSaourceComponent } from '../edit-saource/edit-saource.component';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list-saources',
  templateUrl: './list-saources.component.html',
  styleUrls: ['./list-saources.component.css']
})
export class ListSaourcesComponent implements OnInit{

  constructor(
    private dialog:MatDialog,
    private saourceService:SaourcesService
  ){}

  ngOnInit(): void {
    this.getTotalLenght()    
    this.getSaources()
  }

  filters:ISaourcesFilters = {
    status: '',
    pageIndex: 0,
    pageSize: 0,
    category: 0
  }

  saource_name:string = ''

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
    }
  ]

  saources:ISaource[] = []

  //PAGINATOR
  pageSizeOptions = [2, 5, 10, 25,100];
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

    this.saourceService.getSaources(this.filters)
    .subscribe({

      next: (res:IResponse) => {

        console.log('handlePageEvent getSaources next res',res);
        
        if (res.result) {
          this.saources = res.data
        }

      },
      error: (res:any) => {
        console.log(' handlePageEvent getSaources error res',res);



      }


    })
  }



  //GET SAOURCES
  getSaources(){
    let filters =  this.createFilters()

    this.saourceService.getSaources(filters)
      .subscribe({

        next: (res:IResponse) => {

          console.log('getSaources next res',res);
          
          if (res.result) {
            this.saources = res.data
          }

        },
        error: (error:any) => {
          console.log('getSaources error error',error);
          this.saources = []

        }


      })
  }

  getTotalLenght(){
    let filters =  this.createFilters()
    filters.pageSize = 0
    filters.pageIndex = 0

    this.saourceService.getSaources(filters)
      .subscribe({

        next: (res:IResponse) => {

          console.log('getSaources next res',res);
          
          if (res.result) {
            this.length = res.data.length
          }

        },
        error: (res:any) => {
          console.log('getSaources error res',res);

          this.length = 0

        }


      })
  }


  //SEARCH
  search(){
    this.getTotalLenght()
    this.getSaources()
  }

  //OPEN CREATE SAOURCE DIALOG
  openDialogCreateSaource(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CreateSaourceComponent, {
      data: {},
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe(() => {

      this.filters.status = ''



      this.getTotalLenght()
      this.getSaources()

    })
  }

    //OPEN CREATE SAOURCE DIALOG
    openDialogEditSaource(enterAnimationDuration: string, exitAnimationDuration: string, saource:ISaource): void {
      this.dialog.open(EditSaourceComponent, {
        data: {
          saource:saource
        },
        width: '500px',
        height: '550px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true
      }).afterClosed().subscribe((data) => {
        
        this.filters.status = ''
        this.getTotalLenght()
        this.getSaources()


      })
    }

    //DELETE SAOURCE
    deleteSaource(saource_id:number){

      Swal.fire({
        title: "¿Desea eliminar el platillos?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Si",
        denyButtonText: `No`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.saourceService.deleteSaource(saource_id)
          .subscribe({
  
            next: (res:IResponse) => {
  
              console.log('deleteSaource next res',res);
              
              if (res.result) {
                fireSuccessDialog('Platillo eliminado con éxito')
                
                this.filters.status = ''
                this.filters.pageIndex = 0
                this.filters.pageSize = 10
                this.getTotalLenght()
                this.getSaources()


              }
    
            },
            error: (res:any) => {
  
              console.log('deleteSaource error res',res);
    
                  fireErrorDialog('Error al tratar de eliminar el platillo')
  
    
            }
          })
        } else if (result.isDenied) {
        }
      });


    }

    createFilters():ISaourcesFilters{

      let filters:ISaourcesFilters = {
        status: '',
        pageIndex: 0,
        pageSize: 10,
        category: 0

      }

      this.filters.status == '' ? 
        null :
        filters.status =  this.filters.status

      this.filters.pageIndex == 0 ? 
        null :
        filters.pageIndex =  this.filters.pageIndex
      
      this.filters.pageSize == 0 ? 
        null :
        filters.pageSize =  this.filters.pageSize


      return filters
    }

    getInitLength(){
      let filters =  this.createFilters()
      filters.pageSize = 0
      this.saourceService.getSaources(filters)
        .subscribe({
  
          next: (res:IResponse) => {
  
            console.log('getSaources next res',res);
            
            if (res.result) {
              this.saources = res.data
              this.length = res.data.length
            }
  
          },
          error: (res:any) => {
            console.log('getSaources error res',res);
  
            this.saources = []
  
          }
  
  
        })
    }

}
