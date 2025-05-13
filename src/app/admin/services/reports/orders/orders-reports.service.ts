import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { checkToken } from 'src/app/interceptors/token/token.interceptor.interceptor';
import { IResponse } from 'src/app/shared/interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersReportsService {

  API_URI = environment.API_URSL.API_ORDERS_REPORTS

  constructor(
    private httpCliente: HttpClient
  ) { }


  getOrdersReport(filters:any){
    return this.httpCliente.get<IResponse>(`${this.API_URI}/sales-grouped-by-saource`,{context:checkToken(),params:filters})
  }
}
