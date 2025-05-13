import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { checkToken } from 'src/app/interceptors/token/token.interceptor.interceptor';
import { IEmployeeSalariePaymentInterface } from '../../interfaces/employees-salaries/employee-salarie-payment.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSalariesPaymentsService {

  API_URI =  environment.API_URSL.API_EMPLOYEES_SALARIES_PAYMENTS

  constructor(
    private httpClient:HttpClient
  ) { }

  getPayments(filters:any){
    return this.httpClient.get<IResponse>(`${this.API_URI}`,{context:checkToken(),params:filters})
  }

  updatePayment(payment:IEmployeeSalariePaymentInterface){
    return this.httpClient.put<IResponse>(`${this.API_URI}/${payment.id}`,payment,{context:checkToken()})
  }

  deletePayment(payment_id:number){
    return this.httpClient.delete<IResponse>(`${this.API_URI}/${payment_id}`,{context:checkToken()})
  }



  createPayment(payment:IEmployeeSalariePaymentInterface){
    return this.httpClient.post<IResponse>(`${this.API_URI}`,payment,{context:checkToken()})
  }
}
