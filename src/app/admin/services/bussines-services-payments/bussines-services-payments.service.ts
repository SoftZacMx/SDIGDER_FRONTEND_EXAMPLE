import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { checkToken } from 'src/app/interceptors/token/token.interceptor.interceptor';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { IBussinesServicesInterface } from '../../interfaces/bussines-services/bussines-services.interface';
import { IBussinesServicesPaymentInterface } from '../../interfaces/bussines-services_payments/bussines-services-payments.interface';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BussinesServicesPaymentsService {

  API_URI = environment.API_URSL.API_BUSSINES_SERVICES_PAYMENTS

  constructor(
    private httpClient:HttpClient

  ) { }


  getPaymentsServices(filters:any){
    return this.httpClient.get<IResponse>(`${this.API_URI}`,{context:checkToken(),params:filters})
  }

  updateService(service:IBussinesServicesInterface){
    return this.httpClient.put<IResponse>(`${this.API_URI}/${service.id}`,service,{context:checkToken()})
  }

  deletePaymentService(payment_id:number){
    return this.httpClient.delete<IResponse>(`${this.API_URI}/${payment_id}`,{context:checkToken()})
  }

  paysService(payment:IBussinesServicesPaymentInterface){
    return this.httpClient.post<IResponse>(`${this.API_URI}`,payment,{context:checkToken()})
  }
}
