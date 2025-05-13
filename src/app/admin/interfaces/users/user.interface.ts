export interface IUser{
    id?:number
    name:string,
    last_name:string,
    second_last_name:string,
    email: string,
    password?: string,
    phone:string,
    status:boolean,
    rol:string,
    cash_register_id?:number,
    opening_cash_register_id?:number
}