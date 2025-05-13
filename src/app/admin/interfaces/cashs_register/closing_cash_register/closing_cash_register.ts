export interface IClosingCashRegisterInterface{
    date:string,
    total_cash_payments:number,
    total_transfer_payments:number,
    total_card_payments:number,
    total_tips:number,
    total_iva:number,
    opening_cash_register_id?:number,
    user_id?:number,
    total_operations:number
}