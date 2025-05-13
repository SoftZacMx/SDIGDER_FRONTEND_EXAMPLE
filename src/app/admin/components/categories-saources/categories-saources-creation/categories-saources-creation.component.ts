import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateMerchandisePurchaseComponent } from '../../merchandise-purchase/create-merchandise-purchase/create-merchandise-purchase.component';
import * as moment from 'moment';
import { ICategorySaource } from 'src/app/admin/interfaces/categories-saources/categories-saources-interface';
import { CategoriesSaourcesService } from 'src/app/admin/services/categories-saources/categories-saources.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories-saources-creation',
  templateUrl: './categories-saources-creation.component.html',
  styleUrls: ['./categories-saources-creation.component.css']
})
export class CategoriesSaourcesCreationComponent {

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateMerchandisePurchaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cateogriesSaourcesService:CategoriesSaourcesService
  ){

  }

  status_options = [
    {
      description:'Activa',
      value: true
    },
    {
      description:'Inactiva',
      value: false
    }
  ]
  category = this.formBuilder.group({
    id: this.formBuilder.control(0,[Validators.required]),
    name:  this.formBuilder.control('',[Validators.required,Validators.maxLength(50)]),
    creation_date: this.formBuilder.control(moment().format('YYYY-MM-DD hh:mm:ss'),[Validators.required]),
    status: this.formBuilder.control(true,[Validators.required])
  })

  close(){
    this.dialogRef.close()
  }

  save(){

    const saource_category = this.category.value as ICategorySaource
    this.cateogriesSaourcesService.createSaourcesCategories(saource_category)
      .subscribe({
        next: (res:IResponse) => {
          console.log('createSaourcesCategories next res',res);
          if (res.result) {
            Swal.fire('Correcto','Categoria creada correctamente','success')
            this.dialogRef.close()
          }
        },
        error: (error:any) => {
          console.log('createSaourcesCategories error error',error);
          if (error.error.error) {
            switch (error.error.message) {
              case 'Already exist a category with the same name':
                Swal.fire('Error','Ya existe una categoría con ese nombre','error')

                break;
            
              default:
                Swal.fire('Error','Ocurrio un error al tratar de crear la categoría del producto','error')
                break;
            }

          }
        } 
      })

  }

}
