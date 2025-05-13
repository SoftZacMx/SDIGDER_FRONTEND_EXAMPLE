import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { IEmployeeSalariePaymentInterface } from 'src/app/admin/interfaces/employees-salaries/employee-salarie-payment.interface';
import { ISaource } from 'src/app/admin/interfaces/saources/saource.interface';
import { EmployeeSalariesPaymentsService } from 'src/app/admin/services/employees-salaries-payments/employee-salaries-payments.service';
import { SaourcesService } from 'src/app/admin/services/saources/saources.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';

@Component({
  selector: 'app-edit-employee-salarie-payment',
  templateUrl: './edit-employee-salarie-payment.component.html',
  styleUrls: ['./edit-employee-salarie-payment.component.css']
})
export class EditEmployeeSalariePaymentComponent {

  constructor(
    private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<EditEmployeeSalariePaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private saourceService:SaourcesService,
    private employeeSalariePaymentService:EmployeeSalariesPaymentsService
    ){}
    
  ngOnInit(): void {
    this.setValues()
  }


    /*
    name:string,
    registation_date:string,
    price:number,
    status:boolean
    */


    payment_methods = [
      {
        description:'Efectivo',
        value:1
      },
      {
        description:'Transferncia',
        value:2
      },
    ]

    payment = this.formBuilder.group({
      id: this.formBuilder.control(0,[Validators.required]),
      user_id: this.formBuilder.control(this.data.payment.user_id,[Validators.required,Validators.min(1)]),
      amount: this.formBuilder.control(this.data.payment.amount,[Validators.required,Validators.min(1)]),
      payment_method: this.formBuilder.control(this.data.payment.payment_method,[Validators.required]),
    })

    close(){
      this.dialogRef.close()
    }

    edit(){

      let payment:IEmployeeSalariePaymentInterface = this.payment.value as IEmployeeSalariePaymentInterface

      this.employeeSalariePaymentService.updatePayment(payment)
        .subscribe({
          next : (res:IResponse) => {

            console.log('updatePayment next res',res);
            

            if (res.result) {
              fireSuccessDialog('Pago actualizado con éxito')
              this.close()
            }

          },

          error: (error:any) => {

            console.log('updatePayment error res',error);

            if (error.error.error) {

              fireErrorDialog('Algo salió mal al tratar de editar el pago')
              this.close()

            }

          }
        })

    }

    setValues(){
      
      this.payment.controls.id.setValue(this.data.payment.id)
      this.payment.controls.amount.setValue(this.data.payment.amount)
      switch (this.data.payment.payment_method) {
        case 'Efectivo':
          this.payment.controls.payment_method.setValue(1)
          break;
        case 'Transferencia':
          this.payment.controls.payment_method.setValue(2)
          break;
        default:
          break;
      }
    }

}
