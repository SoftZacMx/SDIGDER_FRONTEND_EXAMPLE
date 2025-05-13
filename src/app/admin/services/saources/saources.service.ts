import { ENVIRONMENT_INITIALIZER, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISaource } from '../../interfaces/saources/saource.interface';
import { environment } from 'src/environments/environment';
import { checkToken } from 'src/app/interceptors/token/token.interceptor.interceptor';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
@Injectable({
  providedIn: 'root'
})
export class SaourcesService {

  API_URI = environment.API_URSL.API_SAOURCES

  constructor(
    private httpClient:HttpClient
  ) { }

  createSaource(saource:ISaource){
    return this.httpClient.post<IResponse>(`${this.API_URI}`,saource,{context:checkToken()})
  }

  getSaources(filters:any){
    return this.httpClient.get<IResponse>(`${this.API_URI}`,{context:checkToken(),params:filters})
  }

  editSaource(saource:ISaource){
    return this.httpClient.put<IResponse>(`${this.API_URI}/${saource.id}`,saource,{context:checkToken()})
  }

  deleteSaource(saource_id:number){
    return this.httpClient.delete<IResponse>(`${this.API_URI}/${saource_id}`,{context:checkToken()})
  }

  getSaourcesMenu(filters:any){
    return this.httpClient.get<IResponse>(`${this.API_URI}/menu`,{params:filters})
  }
}
