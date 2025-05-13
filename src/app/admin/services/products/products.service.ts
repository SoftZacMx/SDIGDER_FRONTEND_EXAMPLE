import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { checkToken } from 'src/app/interceptors/token/token.interceptor.interceptor';
import { IProducts } from '../../interfaces/products/product.interface';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

   API_URI = environment.API_URSL.API_PRODUCTS

  constructor(
    private httpClient: HttpClient
  ) { }


  createProduct(product:IProducts) {
    return this.httpClient.post<IResponse>(`${this.API_URI}`,product,{context:checkToken()});
  }

  getProducts(filters:any) {
    return this.httpClient.get<IResponse>(`${this.API_URI}`,{context:checkToken(),params:filters});
  }

  editProduct(product:IProducts) {
    return this.httpClient.put<IResponse>(`${this.API_URI}/${product.id}`,product,{context:checkToken()});
  }

  
  removeProduct(product_id:number) {
    return this.httpClient.delete<IResponse>(`${this.API_URI}/${product_id}`,{context:checkToken()});
  }
}
