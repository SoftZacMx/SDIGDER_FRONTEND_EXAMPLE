import { Injectable } from '@angular/core';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { getCookie,removeCookie,setCookie } from 'typescript-cookie';
@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  getUserData(){
    let user_data  = {
      id: getCookie('user_id'),
      rol: getCookie('user_rol'),
      name: getCookie('user_name'),
      lastname: getCookie('user_lastname'),
      cash_register_id:parseInt(getCookie('cash_register_id')!),
      opening_cash_register_id:parseInt(getCookie('opening_cash_register_id')!)

    }

    return user_data

    
    
  }

  setUserData(user:IUser){    
    console.log('setUserData user',user);
    
    setCookie('user_rol',user.rol)
    setCookie('user_id',user.id)
    setCookie('user_name',user.name)
    setCookie('user_lastname',user.last_name)
    setCookie('user_second_lastname',user.second_last_name)
    setCookie('cash_register_id',user.cash_register_id)

  }

  setUserDataOpeningCashRegisterId(opening_cash_register_id:number){
    setCookie('opening_cash_register_id',opening_cash_register_id)

  }

  removeUserData(){        
    removeCookie('user_rol')
    removeCookie('user_id')
    removeCookie('user_name')
    removeCookie('user_lastname')
    removeCookie('user_second_lastname')
    removeCookie('cash_register_id')
  }





}



