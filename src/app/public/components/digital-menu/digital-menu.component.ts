import { Component, OnInit } from '@angular/core';
import { ICategorySaource } from 'src/app/admin/interfaces/categories-saources/categories-saources-interface';
import { ICategorysSaourcesFilters } from 'src/app/admin/interfaces/categories-saources/categories-saources.filters.interface';
import { ISaource } from 'src/app/admin/interfaces/saources/saource.interface';
import { ISaourcesFilters } from 'src/app/admin/interfaces/saources/saources.filters.inerface';
import { CategoriesSaourcesService } from 'src/app/admin/services/categories-saources/categories-saources.service';
import { SaourcesService } from 'src/app/admin/services/saources/saources.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-digital-menu',
  templateUrl: './digital-menu.component.html',
  styleUrls: ['./digital-menu.component.css']
})
export class DigitalMenuComponent implements OnInit{

  filter_applyed:string = ''
  saource_name:string = ''
  saources:ISaource[] = []
  saources_categories:ICategorySaource[] = []
  filters:ISaourcesFilters = {
    status: '',
    pageIndex: 0,
    pageSize: 0,
    category:0
  }

  categoriesSaourcesFilters:ICategorysSaourcesFilters = {
    start_date: '',
    end_date: '',
    pageSize: 0,
    pageIndex: 0,
    status: ''
  }
  
  constructor(
    private saourceService:SaourcesService,
    private categoriesSaourcesService:CategoriesSaourcesService

  ){

  }
  ngOnInit(): void {
    this.getSaources()
    this.getSaourcesCategories()
  }

  getSaources(){
    const filters = this.filters
    this.saourceService.getSaourcesMenu(filters)
      .subscribe({
        next: (res:IResponse) => {
          console.log('saources-card getSaources next res',res);
            if (res.result) {
              this.saources = res.data
            }
        },
        error: (error:any) => {
          console.log('saources-card getSaources error error',error);
          this.saources = []
        }
      })
  }

  getSaourcesCategories(){
    const filters = this.categoriesSaourcesFilters
    this.categoriesSaourcesService.getSaourcesCategoriesMenu(filters)
      .subscribe({
        next: (res:IResponse) => {
          console.log('saources-card getSaourcesCategories next res',res);
            if (res.result) {
              this.saources_categories = res.data
            }
        },
        error: (error:any) => {
          console.log('saources-card getSaourcesCategories error error',error);
          Swal.fire('Error','Ocurrio un error al tratar de obtener las categorias de los platillos','error')
        }
      })
  }

  applyFilters(category:number){
    
    this.getCategoryName(category)
    this.filters.category = category
    this.getSaources()
    
  }

  getCategoryName(category_id:number){
    
    if (category_id == 0) {
        this.filter_applyed = 'Todas las categorías'
        return
    }

    const category_found = this.saources_categories.find((category:ICategorySaource  ) => {
      return category.id == category_id
    })
    if (category_found != undefined) {
      this.filter_applyed = category_found.name
    }
    
  }

}
