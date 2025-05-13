export interface IPurchaseMerchandiseInterface{
    date:string,
    total:number,
    subtotal:number,
    iva:number,
    description:string,
    id?:number,
    user_name?:string,
    user_last_name?:string
    user_second_last_name?:string,
    user_id?:string,
    payment_method:number,
    prodcuts:any[]

}