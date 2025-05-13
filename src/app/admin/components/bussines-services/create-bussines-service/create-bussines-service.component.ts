import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EditBussinesServiceComponent } from '../edit-bussines-service/edit-bussines-service.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IBussinesServicesInterface } from 'src/app/admin/interfaces/bussines-services/bussines-services.interface';
import { BussinesServicesService } from 'src/app/admin/services/bussines-services/bussines-services.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import * as moment from 'moment';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';

@Component({
  selector: 'app-create-bussines-service',
  templateUrl: './create-bussines-service.component.html',
  styleUrls: ['./create-bussines-service.component.css']
})
export class CreateBussinesServiceComponent {

  constructor(
    private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<CreateBussinesServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bussinesServicesServices:BussinesServicesService,
    private userDataService:UserDataService
    ){}



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
    
    service =  this.formBuilder.group({
      name: this.formBuilder.control('',[Validators.required,Validators.maxLength(60),Validators.pattern('[0-9A-Za-záéíóúñÑ. ]+')]),
      periodicity:  this.formBuilder.control(0,[Validators.required,Validators.min(1)]),
      status:  this.formBuilder.control(true,[Validators.required]),
      registation_date:  this.formBuilder.control(moment().format('YYYY-MM-DD hh:mm:ss'),[Validators.required]),
      user_id: this.formBuilder.control(this.userDataService.getUserData().id,[Validators.required])
    })

    close(){
      this.dialogRef.close()
    }

    register(){

      let service:IBussinesServicesInterface = this.service.value as IBussinesServicesInterface

      

      this.bussinesServicesServices.createService(service)
        .subscribe({
          next : (res:IResponse) => {

            console.log('createService next res',res);
            

            if (res.result) {
              fireSuccessDialog('Servicio creado con éxito')
              this.close()
            }

          },

          error: (error:any) => {

            console.log('createService error res',error);

            if (error.error.error) {

              fireErrorDialog('Algo salió mal al tratar de crear el servicio')
              this.close()

            }

          }
        })
      

    }



}
