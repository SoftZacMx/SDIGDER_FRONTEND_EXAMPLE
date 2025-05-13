import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { filter } from 'rxjs';
import { ICategorySaource } from 'src/app/admin/interfaces/categories-saources/categories-saources-interface';
import { ICategorysSaourcesFilters } from 'src/app/admin/interfaces/categories-saources/categories-saources.filters.interface';
import { CategoriesSaourcesService } from 'src/app/admin/services/categories-saources/categories-saources.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { CategoriesSaourcesCreationComponent } from '../categories-saources-creation/categories-saources-creation.component';
import Swal from 'sweetalert2';
import { CategoriesSaourcesEditionComponent } from '../categories-saources-edition/categories-saources-edition.component';

@Component({
  selector: 'app-categories-saources-list',
  templateUrl: './categories-saources-list.component.html',
  styleUrls: ['./categories-saources-list.component.css'],
})
export class CategoriesSaourcesListComponent  implements OnInit{


  constructor(private saourcesCategoriesService:CategoriesSaourcesService,private dialog:MatDialog){

  }
  ngOnInit(): void {
    this.getTotalLength()
    this.getCategoriesSaources()
  }

  status_options: any[] = [
    {
      description: 'Activo',
      value: 'true',
    },
    {
      description: 'Inactivo',
      value: 'false',
    },
    {
      description: 'Todos',
      value: '',
    },
  ];
  category_name:string = ''

  categories:ICategorySaource[] = []

  //FILTERS
  filters: ICategorysSaourcesFilters = {
    start_date: '',
    end_date: '',
    pageSize: 0,
    pageIndex: 0,
    status: '',
  };

  createFilters(): ICategorysSaourcesFilters {
    const filters: ICategorysSaourcesFilters = {
      start_date: '',
      end_date: '',
      pageSize: 0,
      pageIndex: 0,
      status: '',
    };

    this.filters.start_date != ''
      ? (filters.start_date = moment(this.filters.start_date).format(
          'YYYY-MM-DD 00:00:00'
        ))
      : null;

    this.filters.end_date != ''
      ? (filters.end_date = moment(this.filters.end_date).format(
          'YYYY-MM-DD 23:59:59'
        ))
      : null;

    filters.status = this.filters.status;
    return filters;
  }

  cleanFilters() {
    this.filters.end_date = '';
    this.filters.start_date = '';
    this.filters.pageIndex = 0;
    this.filters.pageSize = 50;
  }

  cleanInputsFilters(key: string) {
    switch (key) {
      case 'start_date':
        this.filters.start_date = '';
        break;
      case 'end_date':
        this.filters.end_date = '';
        break;
      default:
        break;
    }
  }

 

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


  }

  //GET DATA
  getCategoriesSaources(){
    const filter = this.createFilters()
    console.log('filter',filter);
    
    this.saourcesCategoriesService.getSaourcesCategories(filter)
      .subscribe({
        next: (res:IResponse) => {
          console.log('getSaourcesCategories next res',res);
          if (res.result) {
            this.categories = res.data
          }
        },
        error: (error:any) => {
          console.log('getSaourcesCategories error error',error);
          if (error.error.error) {
            this.categories = []
          }
        }
      })
  }

  getTotalLength(){
    const filter = this.createFilters()
    filter.pageIndex = 0
    this.saourcesCategoriesService.getSaourcesCategories(filter)
      .subscribe({
        next: (res:IResponse) => {
          console.log('getSaourcesCategories next res',res);
          if (res.result) {
            this.length = res.data.length
          }
        },
        error: (error:any) => {
          console.log('getSaourcesCategories error error',error);
          if (error.error.error) {
            this.length = 0

          }
        }
      })
  }

  search(){

    this.getTotalLength()
    this.getCategoriesSaources()
  }

  //SEARCH
  openDialogCreateCateogrySaource(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CategoriesSaourcesCreationComponent, {
      data: {},
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe(() => {

      this.cleanFilters()
      this.getTotalLength()
      this.getCategoriesSaources()

    })
  }

  deleteCateogry(category_id:number){
    Swal.fire({
      title: "¿Desea eliminar la categoría?",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.saourcesCategoriesService.removeSaourcesCategories(category_id)
        .subscribe({
          next: (res:IResponse) => {
            console.log('removeSaourcesCategories next res',res);
            if (res.result) {
             Swal.fire('Correcto','Categoría eliminada con éxito','success')
             this.createFilters()
             this.getTotalLength()
             this.getCategoriesSaources()
            }
          },
          error: (error:any) => {
            console.log('removeSaourcesCategories error error',error);
            if (error.error.error) {
              Swal.fire('Error','Ocurrio un error al tratar de eliminar la categoría','error')
            }
          }
        })
      } else if (result.isDenied) {
        
      }
    });
  }


  editCateogry(enterAnimationDuration: string, exitAnimationDuration: string,category:ICategorySaource){
    this.dialog.open(CategoriesSaourcesEditionComponent, {
      data: {
        category:category
      },
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe(() => {

      this.cleanFilters()
      this.getTotalLength()
      this.getCategoriesSaources()

    })
  }

}
