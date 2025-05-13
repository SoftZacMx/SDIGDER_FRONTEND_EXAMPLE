import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SaourcesService } from 'src/app/admin/services/saources/saources.service';
import { CreateSaourceComponent } from '../../saources/create-saource/create-saource.component';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { ISaource } from 'src/app/admin/interfaces/saources/saource.interface';
import { BussinesServicesService } from 'src/app/admin/services/bussines-services/bussines-services.service';
import { IBussinesServicesInterface } from 'src/app/admin/interfaces/bussines-services/bussines-services.interface';

@Component({
  selector: 'app-edit-bussines-service',
  templateUrl: './edit-bussines-service.component.html',
  styleUrls: ['./edit-bussines-service.component.css']
})
export class EditBussinesServiceComponent implements OnInit{

  constructor(
    private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<EditBussinesServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bussinesServicesServices:BussinesServicesService
    ){}

  ngOnInit(): void {
    this.setValues()
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
    
    service =  this.formBuilder.group({
      id: this.formBuilder.control(this.data.service.id,[Validators.required,Validators.min(1)]),
      name: this.formBuilder.control('',[Validators.required,Validators.pattern('[0-9A-Za-záéíóúñÑ. ]+'),Validators.maxLength(60)]),
      periodicity:  this.formBuilder.control(0,[Validators.required,Validators.min(1)]),
      status:  this.formBuilder.control(false,[Validators.required])

    })

    close(){
      this.dialogRef.close()
    }

    edit(){

      let service:IBussinesServicesInterface = this.service.value as IBussinesServicesInterface

      

      this.bussinesServicesServices.updateService(service)
        .subscribe({
          next : (res:IResponse) => {

            console.log('updateService next res',res);
            

            if (res.result) {
              fireSuccessDialog('Servicio actualizado con éxito')
              this.close()
            }

          },

          error: (error:any) => {

            console.log('updateService error res',error);

            if (error.error.error) {

              fireErrorDialog('Algo salió mal al tratar de editar el servicio')
              this.close()

            }

          }
        })
      

    }

    setValues(){
      console.log('this.data.service',this.data.service);
      
      this.service.controls.name.setValue(this.data.service.name)
      switch (this.data.service.periodicity) {
        case 'Mensual':
          this.service.controls.periodicity.setValue(1)
          break;
        case 'Bimestral':
            this.service.controls.periodicity.setValue(2)
            break;
        default:
          this.service.controls.periodicity.setValue(3)
          break;
      }

      this.data.service.status == true ?
        this.service.controls.status.setValue(true) :
        this.service.controls.status.setValue(false)
    }

}
