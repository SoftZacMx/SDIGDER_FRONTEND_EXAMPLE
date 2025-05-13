import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ISaource } from 'src/app/admin/interfaces/saources/saource.interface';
import { SaourcesService } from 'src/app/admin/services/saources/saources.service';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { SelectSaourceCategoryComponent } from '../../generic/select-saource-category/select-saource-category.component';

@Component({
  selector: 'app-create-saource',
  templateUrl: './create-saource.component.html',
  styleUrls: ['./create-saource.component.css']
})
export class CreateSaourceComponent {

  constructor(
    private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<CreateSaourceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private saourceService:SaourcesService,
    private dialog:MatDialog
    ){}

    /*
    name:string,
    registation_date:string,
    price:number,
    status:boolean
    */

    status_options = [
      {
        description:'Activo',
        value:true
      },
      {
        description:'Inactivo',
        value:false
      }
    ]

    category_name = this.formBuilder.control('')
    saource = this.formBuilder.group({
      name: this.formBuilder.control('',[Validators.required,Validators.pattern('[a-zA-ZáéíóúñÑ -]*')]),
      registation_date: this.formBuilder.control(moment().format('YYYY-MM-DD hh:mm:ss'),[Validators.required]),
      price: this.formBuilder.control(1,[Validators.required,Validators.min(1)]),
      category: this.formBuilder.control(0,[Validators.required,Validators.min(1)]),
      status: this.formBuilder.control(true,[Validators.required])
    })

    close(){
      this.dialogRef.close()
    }

    create(){

      let saurce:ISaource = this.saource.value as ISaource

      this.saourceService.createSaource(saurce)
        .subscribe({
          next : (res:IResponse) => {

            console.log('createSaource next res',res);
            

            if (res.result) {
              fireSuccessDialog('Platillo registrado con éxito')
              this.dialogRef.close()
            }

          },

          error: (error:any) => {

            console.log('createSaource error res',error);

            if (error.error.error) {

              fireErrorDialog('Algo salió mal al tratar de registrar el platillo')
              
            }

          }
        })

    }

    openDialogSelectCategory(enterAnimationDuration: string, exitAnimationDuration: string): void {
      this.dialog.open(SelectSaourceCategoryComponent, {
        data: {},
        width: '500px',
        height: '550px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true
      }).afterClosed().subscribe((data:ISaource) => {
  
        console.log('data',data);
        
        if (data == undefined) {
          return
        }
        this.category_name.setValue(data.name)
        this.saource.controls.category.setValue(data.id)

  
      })
    }

    cleanInputs(key:string){
      switch (key) {
        case 'category':
            this.category_name.setValue('')
            this.saource.controls.category.setValue(0)
          break;
      
        default:
          break;
      }
    }

}
