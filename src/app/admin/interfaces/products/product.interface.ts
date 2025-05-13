export interface IProducts {
    id?: number,
    registation_date:string,
    name:string,
    description:string,
    status:boolean,
    price_history?:number,
    user_id?:number
    amount?:number,
    total?:number,
    unit_of_measurement?:string,
    iva?:number,
    subtotal?:number
}