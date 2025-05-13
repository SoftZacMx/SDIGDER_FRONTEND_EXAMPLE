import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { IPurchaseMerchandiseInterface } from 'src/app/admin/interfaces/purchase_merchandise/purchase_merchandise.interface';
import { PurchaseMerchandiseService } from 'src/app/admin/services/purchase-merchandise/purchase-merchandise.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';
import { CreateMerchandisePurchaseComponent } from '../create-merchandise-purchase/create-merchandise-purchase.component';

@Component({
  selector: 'app-edit-merchandise-purchase',
  templateUrl: './edit-merchandise-purchase.component.html',
  styleUrls: ['./edit-merchandise-purchase.component.css']
})
export class EditMerchandisePurchaseComponent implements OnInit {
  constructor(
    private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<CreateMerchandisePurchaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private purcheMerchandiseService:PurchaseMerchandiseService,
    private userDataService:UserDataService
    ){}
    
  ngOnInit(): void {
    this.setValues()
  }

    payment_methods = [
      {
        value: 1,
        description: 'Efectivo'
      },
      {
        value: 2,
        description: 'Transferencia'
      }
    ]
    iva_amount:number = 0


    /*
    date:string,
    total:number,
    subtotal:number,
    iva:number,
    description:string,
    id?:number,
    user_name?:string,
    user_last_name?:string
    user_second_last_name?:string
    */

    purchase_merchandice = this.formBuilder.group({
      total: this.formBuilder.control(0,[Validators.required,Validators.min(1)]),
      subtotal: this.formBuilder.control(0,[Validators.required,Validators.min(1)]),
      iva: this.formBuilder.control(0,[Validators.required,Validators.min(0)]),
      description: this.formBuilder.control('',[Validators.pattern('[0-9A-Za-záéíóúñÑ. ]+'),]),
      payment_method: this.formBuilder.control(1,[Validators.required,Validators.min(1)]),
      id:this.formBuilder.control(0,[Validators.required,Validators.min(1)])
    })


    close(){
      this.dialogRef.close()
    }

    update(){

      
      let purchase_merchandise:IPurchaseMerchandiseInterface = this.purchase_merchandice.value as IPurchaseMerchandiseInterface

      this.purcheMerchandiseService.updatePurchaseMerchandise(purchase_merchandise)
        .subscribe({
          next : (res:IResponse) => {

            console.log('updatePurchaseMerchandise next res',res);
            

            if (res.result) {
              fireSuccessDialog('Compra actualizada con éxito')
              this.dialogRef.close()
            }

          },

          error: (error:any) => {

            console.log('updatePurchaseMerchandise error res',error);

            if (error.error.error) {

              fireErrorDialog('Algo salió mal al tratar de actualizar la compra')

            }

          }
        })
      

    }


    setValues(){
      this.purchase_merchandice.controls.description.setValue(this.data.purchase_merchandise.description)
      this.purchase_merchandice.controls.total.setValue(this.data.purchase_merchandise.total)
      this.purchase_merchandice.controls.subtotal.setValue(this.data.purchase_merchandise.subtotal)
      let porcentage = (this.data.purchase_merchandise.iva * 100) / this.data.purchase_merchandise.subtotal
      this.purchase_merchandice.controls.iva.setValue(porcentage)
      this.purchase_merchandice.controls.payment_method.setValue(this.data.purchase_merchandise.payment_method)
      this.purchase_merchandice.controls.id.setValue(this.data.purchase_merchandise.id)
    }


    setTotal(){

      let subtotal =  this.purchase_merchandice.controls.subtotal.value!
      let iva = this.purchase_merchandice.controls.iva.value!

      if(iva > 0){
        this.iva_amount = (subtotal * (iva/100))
        let total = (this.iva_amount + subtotal)
        this.purchase_merchandice.controls.total.setValue(total)
      }else{
        this.iva_amount = 0

      }

    }

}
