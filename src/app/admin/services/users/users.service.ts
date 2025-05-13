import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { checkToken } from 'src/app/interceptors/token/token.interceptor.interceptor';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { IUser } from '../../interfaces/users/user.interface';
@Injectable({
  providedIn: 'root'
})
export class UsersService {


  API_URI = environment.API_URSL.API_USERS.USERS
  

  constructor(
    private httpClient:HttpClient
  ) { }

  getUsers(filters:any){
    return this.httpClient.get<IResponse>(`${this.API_URI}`,{context:checkToken(),params:filters})
  }

  createUser(user:IUser){
    return this.httpClient.post<IResponse>(`${this.API_URI}`,user,{context:checkToken()})
  }

  editUser(user:IUser){
    return this.httpClient.put<IResponse>(`${this.API_URI}/${user.id}`,user,{context:checkToken()})
  }


  deleteUser(user_id:number){
    return this.httpClient.delete<IResponse>(`${this.API_URI}/${user_id}`,{context:checkToken()})
  }
}
