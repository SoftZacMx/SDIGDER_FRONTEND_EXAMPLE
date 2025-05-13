import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { checkToken } from 'src/app/interceptors/token/token.interceptor.interceptor';
import { ITable } from '../../interfaces/tables/table.interface';
@Injectable({
  providedIn: 'root'
})
export class TablesService {

  API_URI = environment.API_URSL.API_TABLES

  constructor(
    private httpClient:HttpClient
  ) { }


  createTable(table:ITable){
    return this.httpClient.post(`${this.API_URI}`,table,{context:checkToken()})
  }

  getTables(filters:any){
    return this.httpClient.get(`${this.API_URI}`,{context:checkToken(),params:filters})
  }

 editTable(table:ITable){
    return this.httpClient.put(`${this.API_URI}/${table.id}`,table,{context:checkToken()})
  }

  deleteTable(table_id:number){
    return this.httpClient.delete(`${this.API_URI}/${table_id}`,{context:checkToken()})
  }
}
