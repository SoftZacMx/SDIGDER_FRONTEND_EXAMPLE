import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { checkToken } from 'src/app/interceptors/token/token.interceptor.interceptor';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { IBussinesServicesInterface } from '../../interfaces/bussines-services/bussines-services.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BussinesServicesService {

  API_URI = environment.API_URSL.API_BUSSINES_SERVICES

  constructor(
    private httpClient:HttpClient

  ) { }


  getServices(filters:any){
    return this.httpClient.get<IResponse>(`${this.API_URI}`,{context:checkToken(),params:filters})
  }

  updateService(service:IBussinesServicesInterface){
    return this.httpClient.put<IResponse>(`${this.API_URI}/${service.id}`,service,{context:checkToken()})
  }

  deleteService(service_id:number){
    return this.httpClient.delete<IResponse>(`${this.API_URI}/${service_id}`,{context:checkToken()})
  }

  createService(service:IBussinesServicesInterface){
    return this.httpClient.post<IResponse>(`${this.API_URI}`,service,{context:checkToken()})
  }
}
