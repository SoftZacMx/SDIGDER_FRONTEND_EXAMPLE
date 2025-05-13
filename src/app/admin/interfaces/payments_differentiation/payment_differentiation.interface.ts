export interface IPaymentsDifferentiation {
    id?:string,
    first_payment_amount:number,
    first_payment_payment_method:number,
    second_payment_amount:number,
    second_payment_payment_method:number,
    order_id:number
}