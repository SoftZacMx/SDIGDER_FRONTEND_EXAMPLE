import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { checkToken } from 'src/app/interceptors/token/token.interceptor.interceptor';
import { ICategorySaource } from '../../interfaces/categories-saources/categories-saources-interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesSaourcesService {

  URL = environment.API_URSL.API_SAOURCES_CATEGORIES
  constructor(
    private httpClient:HttpClient
  ) { }

  getSaourcesCategories(filters:any){
    return this.httpClient.get(`${this.URL}`,{context:checkToken(),params:filters})
  }

  createSaourcesCategories(category:ICategorySaource){
    return this.httpClient.post(`${this.URL}`,category,{context:checkToken()})
  }

  updateSaourcesCategories(category:ICategorySaource){
    return this.httpClient.put(`${this.URL}/${category.id}`,category,{context:checkToken()})
  }

  removeSaourcesCategories(category_id:number){
    return this.httpClient.delete(`${this.URL}/${category_id}`,{context:checkToken()})
  }


  getSaourcesCategoriesMenu(filters:any){
    return this.httpClient.get(`${this.URL}/menu`,{params:filters})
  }

}
