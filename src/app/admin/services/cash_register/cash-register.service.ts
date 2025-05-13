import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICashRegisterFiltersInterface } from '../../interfaces/cashs_register/cash-register.filters.interface';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { checkToken } from 'src/app/interceptors/token/token.interceptor.interceptor';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs';
import { ICashRegisterInterface } from '../../interfaces/cashs_register/cash-register.interface';
import { IOpeningCashRegister } from '../../interfaces/cashs_register/opening-cash-register.interface';
import { IClosingCashRegisterInterface } from '../../interfaces/cashs_register/closing_cash_register/closing_cash_register';

@Injectable({
  providedIn: 'root'
})
export class CashRegisterService {

  constructor(
    private httpClient:HttpClient
  ) { }

  API_URI = environment.API_URSL.API_CASHS_REGISTER
  API_URI_CASH_REGISTERS_OPERATIONS = environment.API_URSL.API_CASHS_OPERATIONS


  getCashsRegister(filters:any){
    return this.httpClient.get<IResponse>(`${this.API_URI}`,{context:checkToken(),params:filters})
  }

  getCashRegister(cash_register:ICashRegisterInterface){
    return this.httpClient.get<IResponse>(`${this.API_URI}/${cash_register.id}`,{context:checkToken()})
  }

  createCashRegister(cash_register:ICashRegisterInterface){
    return this.httpClient.post<IResponse>(`${this.API_URI}`,cash_register,{context:checkToken()})
  }

  updateCashRegister(cash_register:ICashRegisterInterface){
    return this.httpClient.put<IResponse>(`${this.API_URI}/${cash_register.id}`,cash_register,{context:checkToken()})
  }

  deleteCashRegister(cash_register_id:number){
    return this.httpClient.delete<IResponse>(`${this.API_URI}/${cash_register_id}`,{context:checkToken()})
  }

  openCashRegister(opening_cash_register:IOpeningCashRegister){
    return this.httpClient.put<IResponse>(`${this.API_URI_CASH_REGISTERS_OPERATIONS}/open/:${opening_cash_register.cash_register_id}`,opening_cash_register,{context:checkToken()})
  }

  verifyOpeningCashRegister(cash_register_id:number){
    return this.httpClient.get<IResponse>(`${this.API_URI_CASH_REGISTERS_OPERATIONS}/verify-opening/${cash_register_id}`,{context:checkToken()})
  }

  getOpeningCashRegisters(filters:any){
    
    return this.httpClient.get<IResponse>(`${this.API_URI_CASH_REGISTERS_OPERATIONS}/opening_cash_registers`,{context:checkToken(),params:filters})
  }

  getOpeningCashRegistersOperations(opening_cash_register_id:number){
    
    return this.httpClient.get<IResponse>(`${this.API_URI_CASH_REGISTERS_OPERATIONS}/opening_cash_registers/operations/${opening_cash_register_id}`,{context:checkToken()})
  }


  closeCashRegister(closing_cash_register:IClosingCashRegisterInterface){
    
    return this.httpClient.put<IResponse>(`${this.API_URI_CASH_REGISTERS_OPERATIONS}/close/${closing_cash_register.opening_cash_register_id}`,closing_cash_register,{context:checkToken()})
  }

}
