import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EditEmployeeSalariePaymentComponent } from '../edit-employee-salarie-payment/edit-employee-salarie-payment.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IEmployeeSalariePaymentInterface } from 'src/app/admin/interfaces/employees-salaries/employee-salarie-payment.interface';
import { EmployeeSalariesPaymentsService } from 'src/app/admin/services/employees-salaries-payments/employee-salaries-payments.service';
import { SaourcesService } from 'src/app/admin/services/saources/saources.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import * as moment from 'moment';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { SelectUserComponent } from '../../generic/select-user/select-user.component';

@Component({
  selector: 'app-create-employee-salarie-payment',
  templateUrl: './create-employee-salarie-payment.component.html',
  styleUrls: ['./create-employee-salarie-payment.component.css']
})
export class CreateEmployeeSalariePaymentComponent {

  user:string = ''

  constructor(
    private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<EditEmployeeSalariePaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private saourceService:SaourcesService,
    private employeeSalariePaymentService:EmployeeSalariesPaymentsService,
    private dialog:MatDialog

    ){}
    
  ngOnInit(): void {

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
      user_id: this.formBuilder.control(0,[Validators.required,Validators.min(1)]),
      amount: this.formBuilder.control(0,[Validators.required,Validators.min(1)]),
      payment_method: this.formBuilder.control(1,[Validators.required]),
      date: this.formBuilder.control(moment().format('YYYY-MM-DD hh:mm:ss'),[Validators.required]),

    })

    close(){
      this.dialogRef.close()
    }

    pay(){

      let payment:IEmployeeSalariePaymentInterface = this.payment.value as IEmployeeSalariePaymentInterface

      this.employeeSalariePaymentService.createPayment(payment)
        .subscribe({
          next : (res:IResponse) => {

            console.log('createPayment next res',res);
            

            if (res.result) {
              fireSuccessDialog('Pago creado con éxito')
              this.close()
            }

          },

          error: (error:any) => {

            console.log('createPayment error res',error);

            if (error.error.error) {

              fireErrorDialog('Algo salió mal al tratar de crear el pago')
              this.close()

            }

          }
        })

    }



        //OPEN SELECT USER
        openDialogSelectUser(enterAnimationDuration: string, exitAnimationDuration: string): void {
          this.dialog.open(SelectUserComponent, {
            data: {},
            width: '500px',
            height: '550px',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true
          }).afterClosed().subscribe((data:IUser) => {
    
            
            if (data == null) {
              return
            }
    
            this.user = `${data.name} ${data.last_name} ${data.second_last_name}`
            this.payment.controls.user_id.setValue(data.id!)
    
          })
        }


        clean(){
          this.user = ''
          this.payment.controls.user_id.setValue(0)
        }

}
