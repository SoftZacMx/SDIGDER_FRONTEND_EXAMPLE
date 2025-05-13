import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { checkToken } from 'src/app/interceptors/token/token.interceptor.interceptor';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { IPurchaseMerchandiseInterface } from '../../interfaces/purchase_merchandise/purchase_merchandise.interface';
@Injectable({
  providedIn: 'root'
})
export class PurchaseMerchandiseService {

  API_URI =  environment.API_URSL.API_MERCHANDISE_PURCHASE

  constructor(
    private httpClient:HttpClient
  ) { }

  getMerchandisesPurchase(filters:any){
    return this.httpClient.get<IResponse>(`${this.API_URI}`,{context:checkToken(),params:filters})
  }

  createPurchaseMerchandise(purchase_merchandise:IPurchaseMerchandiseInterface){
    return this.httpClient.post<IResponse>(`${this.API_URI}`,purchase_merchandise,{context:checkToken()})
  }


  updatePurchaseMerchandise(purchase_merchandise:IPurchaseMerchandiseInterface){
    return this.httpClient.put<IResponse>(`${this.API_URI}/${purchase_merchandise.id}`,purchase_merchandise,{context:checkToken()})
  }

  deletePurchaseMerchandise(purchase_id:number){
    return this.httpClient.delete<IResponse>(`${this.API_URI}/${purchase_id}`,{context:checkToken()})
  }

  getMerchandisePurchaseProducts(purchase_id:number){
    return this.httpClient.get<IResponse>(`${this.API_URI}/${purchase_id}/products`,{context:checkToken()})
  }





}
