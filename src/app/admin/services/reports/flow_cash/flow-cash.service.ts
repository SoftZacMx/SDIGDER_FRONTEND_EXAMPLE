import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { checkToken } from 'src/app/interceptors/token/token.interceptor.interceptor';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlowCashService {

  API_URI = environment.API_URSL.API_REPORTS

  constructor(
    private httpClient:HttpClient
  ) { }

  getFlowCashReport(filters:any){
    return this.httpClient.get<IResponse>(`${this.API_URI}/cash_flow`,{context:checkToken(),params:filters})
  }

}
