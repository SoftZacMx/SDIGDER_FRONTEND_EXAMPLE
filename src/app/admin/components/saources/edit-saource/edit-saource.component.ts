import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ISaource } from 'src/app/admin/interfaces/saources/saource.interface';
import { SaourcesService } from 'src/app/admin/services/saources/saources.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { CreateSaourceComponent } from '../create-saource/create-saource.component';
import { SelectSaourceCategoryComponent } from '../../generic/select-saource-category/select-saource-category.component';

@Component({
  selector: 'app-edit-saource',
  templateUrl: './edit-saource.component.html',
  styleUrls: ['./edit-saource.component.css']
})
export class EditSaourceComponent implements OnInit{
  category_name = this.formBuilder.control('')

  constructor(
    private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<CreateSaourceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private saourceService:SaourcesService,
    private dialog:MatDialog
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

    saource = this.formBuilder.group({
      id: this.formBuilder.control(0,[Validators.required]),
      name: this.formBuilder.control('',[Validators.required,Validators.pattern('[a-zA-ZáéíóúñÑ -]*')]),
      registation_date: this.formBuilder.control(moment().format('YYYY-MM-DD hh:mm:ss'),[Validators.required]),
      price: this.formBuilder.control(1,[Validators.required,Validators.min(1)]),
      status: this.formBuilder.control(true,[Validators.required]),
      category: this.formBuilder.control(0,[Validators.required,Validators.min(1)]),

    })

    close(){
      this.dialogRef.close()
    }

    edit(){

      let saurce:ISaource = this.saource.value as ISaource      

      this.saourceService.editSaource(saurce)
        .subscribe({
          next : (res:IResponse) => {            

            if (res.result) {
              fireSuccessDialog('Platillo actualizado con éxito')
              this.close()
            }

          },

          error: (error:any) => {

            console.log('editSaource error res',error);

            if (error.error.error) {

              fireErrorDialog('Algo salió mal al tratar de editar el platillo')
              this.close()

            }

          }
        })

    }

    setValues(){
      
      this.saource.controls.id.setValue(this.data.saource.id)
      this.saource.controls.name.setValue(this.data.saource.name),
      this.saource.controls.price.setValue(this.data.saource.price)
      this.data.saource.status == true ? this.saource.controls.status.setValue(true) : this.saource.controls.status.setValue(false)
      this.saource.controls.category.setValue(this.data.saource.category_id)
      this.category_name.setValue(this.data.saource.category_name)
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
