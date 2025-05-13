import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { IBussinesServicesInterface } from 'src/app/admin/interfaces/bussines-services/bussines-services.interface';
import { BussinesServicesService } from 'src/app/admin/services/bussines-services/bussines-services.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';
import { CreateBussinesServiceComponent } from '../create-bussines-service/create-bussines-service.component';
import { BussinesServicesPaymentsService } from 'src/app/admin/services/bussines-services-payments/bussines-services-payments.service';
import { IBussinesServicesPaymentInterface } from 'src/app/admin/interfaces/bussines-services_payments/bussines-services-payments.interface';
import { SelectServiceComponent } from '../../generic/select-service/select-service.component';

@Component({
  selector: 'app-pay-service',
  templateUrl: './pay-service.component.html',
  styleUrls: ['./pay-service.component.css']
})
export class PayServiceComponent implements OnInit {

  service!:IBussinesServicesInterface

  service_name:string = ''

  constructor(
    private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<PayServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bussinesServicesPaymentsServices:BussinesServicesPaymentsService,
    private userDataService:UserDataService,
    private dialog:MatDialog
    ){}


  ngOnInit(): void {

    console.log('data',this.data);
    
    
    if (this.data.service != undefined) {
      this.service =  this.data.service
    }else{
      this.openDialogSelectService('500','500')
      this.service = {
        name: '',
        periodicity: 1, 
        registation_date : moment().format('YYYY-MM-DD hh:mm:ss'), 
        status: false,
        id: 0
      }
    }
  }


  periodicity_options = [ 
    {
      value:1,
      description:'Mensual'
    },
    {
      value:2,
      description:'Bimestral'
    },
    {
      value:3,
      description:'Otro'
    },
  ]
  status_options = [ 
    {
      value:true,
      description:'Activo'
    },
    {
      value:false,
      description:'Inactivo'
    }
  ]
  /*
    amount:number,
    date:string,
    user_id?:number,
    service_id?:boolean,
    id?:number
  */
  payment =  this.formBuilder.group({
    amount: this.formBuilder.control(0,[Validators.required,Validators.min(1)]),
    date:  this.formBuilder.control(moment().format('YYYY-MM-DD hh:mm:ss'),[Validators.required]),
    user_id:  this.formBuilder.control(this.userDataService.getUserData().id,[Validators.required]),
    service_id:  this.formBuilder.control( this.data.service != undefined ? this.data.service.id : 0  ,[Validators.required]),
  })

  close(){
    this.dialogRef.close()
  }

  pay(){

    
    let payment:IBussinesServicesPaymentInterface = this.payment.value as IBussinesServicesPaymentInterface

    

    this.bussinesServicesPaymentsServices.paysService(payment)
      .subscribe({
        next : (res:IResponse) => {

          console.log('payService next res',res);
          

          if (res.result) {
            fireSuccessDialog('Servicio pagado con éxito')
            this.close()
          }

        },

        error: (error:any) => {

          console.log('payService error res',error);

          if (error.error.error) {

            fireErrorDialog('Algo salió mal al tratar de pagar el servicio')
            this.close()

          }

        }
      })

    
    

  }

    //OPEN DIALOG SELECT SERVICE
    openDialogSelectService(enterAnimationDuration: string, exitAnimationDuration: string): void {
      this.dialog.open(SelectServiceComponent, {
        data: {},
        width: '600px',
        height: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true
      }).afterClosed().subscribe((data) => {
        
        if (data ==  undefined) {
            this.dialog.closeAll()
            return
        }
        
        this.service_name =  data[0].name
        this.payment.controls.service_id.setValue(data[0].id)
        this.service =  data[0]



      })
    }

}
