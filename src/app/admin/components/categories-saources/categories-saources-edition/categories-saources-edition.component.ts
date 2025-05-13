import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ICategorySaource } from 'src/app/admin/interfaces/categories-saources/categories-saources-interface';
import { CategoriesSaourcesService } from 'src/app/admin/services/categories-saources/categories-saources.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories-saources-edition',
  templateUrl: './categories-saources-edition.component.html',
  styleUrls: ['./categories-saources-edition.component.css']
})
export class CategoriesSaourcesEditionComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CategoriesSaourcesEditionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cateogriesSaourcesService:CategoriesSaourcesService
  ){

  }

  ngOnInit(): void {
    this.setData()
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
    status: this.formBuilder.control(true,[Validators.required])
  })


  close(){
    this.dialogRef.close()
  }

  save(){

    const saource_category = this.category.value as ICategorySaource
    console.log('saource_category',saource_category);

    this.cateogriesSaourcesService.updateSaourcesCategories(saource_category)
      .subscribe({
        next: (res:IResponse) => {
          console.log('createSaourcesCategories next res',res);
          if (res.result) {
            Swal.fire('Correcto','Categoria actualizada correctamente','success')
            this.dialogRef.close()
          }
        },
        error: (error:any) => {
          console.log('createSaourcesCategories error error',error);
          if (error.error.error) {
            Swal.fire('Error','Ocurrio un error al tratar de actualizar la categoría','error')

          }
        } 
      })

  }

  setData(){    
    this.category.controls.id.setValue(this.data.category.id) 
    this.category.controls.name.setValue(this.data.category.name) 
    this.category.controls.status.setValue(this.data.category.status == 1 ? true :false) 
    
  }

}
