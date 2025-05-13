import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductCreationComponent } from '../product-creation/product-creation.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { IProducts } from 'src/app/admin/interfaces/products/product.interface';
import { ProductsService } from 'src/app/admin/services/products/products.service';
import { fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit{

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProductCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productsService:ProductsService,
    private userDataService:UserDataService
  ) { 
    
  }

  ngOnInit(): void {
    this.setData()
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
    id: this.formBuilder.control(0,[Validators.required,Validators.min(1)]),
    name: this.formBuilder.control('',[Validators.required,Validators.pattern('[0-9A-Za-záéíóúnÑ ]+'),Validators.maxLength(100)]),
    registation_date: this.formBuilder.control(moment().format('YYYY-MM-DD hh:mm:ss'),[Validators.required]),
    description: this.formBuilder.control('Sin descripción',[Validators.required,Validators.pattern('[0-9A-Za-záéíóúnÑ. ]+'),Validators.maxLength(1000)]),
    status: this.formBuilder.control(true,[Validators.required]),
    user_id: this.formBuilder.control(parseInt(this.userDataService.getUserData().id), [Validators.required])
  })


  edit(){

    let product:IProducts =  this.product.value as IProducts
    product.description == '' ? product.description = 'Sin descripcion' : null
    this.productsService.editProduct(product)
      .subscribe({
        next: (res:IResponse) => {
          console.log('editProduct next res',res)
          if (res.result) {
            fireSuccessDialog('Producto actualizado con éxito')
            this.dialogRef.close()
          }
        },
        error: (error:any) => {
          console.log('editProduct error res',error)
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

  setData(){
    this.product.controls.id.setValue(this.data.product.id)
    this.product.controls.name.setValue(this.data.product.name)
    this.product.controls.description.setValue(this.data.product.description)
    this.data.product.status == true ?
      this.product.controls.status.setValue(true) : this.product.controls.status.setValue(false)
  }

}
