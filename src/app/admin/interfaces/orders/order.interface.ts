export interface IOrder{
    id?:number,
    date:string,
    status:boolean,
    payment_method:number,
    total:number,
    subtotal:number,
    iva:number,
    cash_register_id:number
    name?:string
    last_name?:string
    second_last_name?:string,
    saources:any[],
    user_id:number,
    opening_cash_register_id?:number
    delivered?:boolean,
    table_number:number,
    tip:number
    origin:string,
    client?:string,
    differ_payment?:boolean,
    payment_differ?:any
    
    first_payment_payment_method?: number,
    first_payment_amount?: number,

    second_payment_amount?:number,
    second_payment_payment_method?: number,

    number_table?:string,
    assigned_table?:string
    note:string


}