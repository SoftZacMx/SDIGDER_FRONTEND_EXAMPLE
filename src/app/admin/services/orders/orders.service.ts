import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { checkToken } from 'src/app/interceptors/token/token.interceptor.interceptor';
import { IOrder } from '../../interfaces/orders/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  API_URI = environment.API_URSL.API_ORDERS

  constructor(
    private httpClient: HttpClient
  ) { }

  getOrders(filters: any) {
    return this.httpClient.get<IResponse>(`${this.API_URI}`, { context: checkToken(), params: filters })
  }

  getOrder(order_id: number) {
    return this.httpClient.get<IResponse>(`${this.API_URI}/${order_id}`, { context: checkToken() })
  }

  getSaourcesOrder(order_id: number) {
    return this.httpClient.get<IResponse>(`${this.API_URI}/saources/${order_id}`, { context: checkToken() })
  }

  createOrder(order: IOrder) {
    return this.httpClient.post<IResponse>(`${this.API_URI}`, order, { context: checkToken() })
  }

  deleteOrder(order_id: number) {
    return this.httpClient.delete<IResponse>(`${this.API_URI}/delete/${order_id}`, { context: checkToken() })
  }

  deliverOrder(order_id: number) {
    return this.httpClient.put<IResponse>(`${this.API_URI}/deliver/${order_id}`, null, { context: checkToken() })
  }

  payOrder(order_id: number,order:IOrder) {
    console.log('ordersService patOrder order',order);
    
    return this.httpClient.put<IResponse>(`${this.API_URI}/pay/${order_id}`,order, { context: checkToken() })
  }

  updateOrder(order: IOrder) {
    return this.httpClient.put<IResponse>(`${this.API_URI}/update/${order.id}`, order, { context: checkToken() })
  }

  deleteSaourceOfOrder(order_id:number,saource_id:number){
    return this.httpClient.delete(`${this.API_URI}/order/${order_id}/saource/${saource_id}`,{context:checkToken()})
  }

  getPaymentsDifferentiations(order_id:number){
    return this.httpClient.get(`${this.API_URI}/${order_id}/payments_differentiation`,{context:checkToken()})
  }

}
