import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { IProducts } from 'src/app/admin/interfaces/products/product.interface';
import { ProductsService } from 'src/app/admin/services/products/products.service';
import { fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';

@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.css']
})
export class ProductCreationComponent {

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProductCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productsService:ProductsService,
    private userDataService:UserDataService
  ) { 
    
  }

  status_options = [
    {
      value: true,
      description: 'Activo'
    },
    {
      value: false,
      description: 'Inactivo'
    }

  ]

  product = this.formBuilder.group({
    name: this.formBuilder.control('',[Validators.required,Validators.pattern('[0-9A-Za-záéíóúnÑ ]+'),Validators.maxLength(100)]),
    registation_date: this.formBuilder.control(moment().format('YYYY-MM-DD hh:mm:ss'),[Validators.required]),
    description: this.formBuilder.control('Sin descripción',[Validators.required,Validators.pattern('[0-9A-Za-záéíóúnÑ. ]+'),Validators.maxLength(1000)]),
    status: this.formBuilder.control(true,[Validators.required]),
    user_id: this.formBuilder.control(parseInt(this.userDataService.getUserData().id), [Validators.required])
  })


  create(){

    let product:IProducts =  this.product.value as IProducts
    product.description == '' ? product.description = 'Sin descripcion' : null
    this.productsService.createProduct(product)
      .subscribe({
        next: (res:IResponse) => {
          console.log('createProduct next res',res)
          if (res.result) {
            fireSuccessDialog('Producto registrado con éxito')
            this.dialogRef.close()
          }
        },
        error: (error:any) => {
          console.log('createProduct error res',error)
          if (error.error.error) {
            switch (error.error.message) {
              case '':
                
                break;
            
              default:
                break;
            }
          }
        }
      })
  }

  close(){
    this.dialogRef.close()
  }

}
