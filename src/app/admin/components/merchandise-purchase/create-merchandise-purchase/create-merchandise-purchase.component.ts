import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SaourcesService } from 'src/app/admin/services/saources/saources.service';
import { CreateSaourceComponent } from '../../saources/create-saource/create-saource.component';
import { PurchaseMerchandiseService } from 'src/app/admin/services/purchase-merchandise/purchase-merchandise.service';
import * as moment from 'moment';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';
import { IPurchaseMerchandiseInterface } from 'src/app/admin/interfaces/purchase_merchandise/purchase_merchandise.interface';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { SelectProductsComponent } from '../../generic/select-products/select-products.component';
import { IProducts } from 'src/app/admin/interfaces/products/product.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-merchandise-purchase',
  templateUrl: './create-merchandise-purchase.component.html',
  styleUrls: ['./create-merchandise-purchase.component.css']
})
export class CreateMerchandisePurchaseComponent {

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateMerchandisePurchaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private purcheMerchandiseService: PurchaseMerchandiseService,
    private userDataService: UserDataService,
    private dialog: MatDialog
  ) { }

  payment_methods = [
    {
      value: 1,
      description: 'Efectivo'
    },
    {
      value: 2,
      description: 'Transferencia'
    },
    {
      value: 3,
      description: 'Tarjeta'
    }
  ]

  iva_amount: number = 0

  unit_of_mesure_options = [
    {
      value:'kg',
      description:'Kilogramos'
    },
    {
      value:'g',
      description:'Gramos'
    },
    {
      value:'p',
      description:'Piezas'
    }
  ]
  /*
  date:string,
  total:number,
  subtotal:number,
  iva:number,
  description:string,
  id?:number,
  user_name?:string,
  user_last_name?:string
  user_second_last_name?:string
  */

  purchase_merchandice = this.formBuilder.group({
    date: this.formBuilder.control(moment().format('YYYY-MM-DD hh:mm:ss'), [Validators.required]),
    total: this.formBuilder.control(1, [Validators.required, Validators.min(1)]),
    subtotal: this.formBuilder.control(1, [Validators.required, Validators.min(1)]),
    iva: this.formBuilder.control(0, [Validators.required, Validators.min(0), Validators.pattern('[0-9]+')]),
    description: this.formBuilder.control('', [Validators.pattern('[0-9A-Za-záéíóúñÑ., ]+'), Validators.maxLength(500)]),
    user_id: this.formBuilder.control(this.userDataService.getUserData().id!, [Validators.required, Validators.min(1)]),
    payment_method: this.formBuilder.control(1, [Validators.required, Validators.min(1)]),
    products: this.formBuilder.array([]),
  })

  total:number = 0
  subtotal:number = 0
  iva_ammount:number = 0

  close() {
    this.dialogRef.close()
  }

  create() {

    let purchase_merchandise: IPurchaseMerchandiseInterface = this.purchase_merchandice.value as IPurchaseMerchandiseInterface
    purchase_merchandise.iva = this.iva_amount
    console.log('create Purchase Merchandise',purchase_merchandise);
        
    this.purcheMerchandiseService.createPurchaseMerchandise(purchase_merchandise)
      .subscribe({
        next: (res: IResponse) => {

          console.log('createPurchaseMerchandise next res', res);


          if (res.result) {
            fireSuccessDialog('Compra registrado con éxito')
            this.dialogRef.close()
          }

        },

        error: (error: any) => {

          console.log('createPurchaseMerchandise error res', error);

          if (error.error.error) {

            fireErrorDialog('Algo salió mal al tratar de registrar la compra')

          }

        }
      })
  
  }

  setTotal() {

    let subtotal = this.purchase_merchandice.controls.subtotal.value!
    let iva = this.purchase_merchandice.controls.iva.value!

    if (iva > 0) {
      this.iva_amount = (subtotal * (iva / 100))
      let total = (this.iva_amount + subtotal)
      this.purchase_merchandice.controls.total.setValue(total)
    } else {
      this.iva_amount = 0

    }

  }



  openDialogSelectProducts(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SelectProductsComponent, {
      data: {},
      width: '550px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe((data: IProducts[]) => {


      if (data == null) {
        return
      }

      this.setFormArrayData(data)


    })
  }


  setFormArrayData(productsArray: IProducts[]) {


    let productsFormArray = this.purchase_merchandice.controls.products as FormArray

    productsArray.map((product: IProducts) => {

      //Create the aux form group
      let auxProductsFormGroup = this.formBuilder.group({
        id: this.formBuilder.control(product.id, [Validators.required, Validators.min(1)]),
        name: this.formBuilder.control(product.name, [Validators.required, Validators.maxLength(60)]),
        subtotal: this.formBuilder.control(0, [Validators.required, Validators.min(1)]),
        total: this.formBuilder.control(0, [Validators.required, Validators.min(1)]),
        unit_of_mesure: this.formBuilder.control('kg', Validators.required),
        amount: this.formBuilder.control(1, [Validators.required, Validators.min(1)]),
      })
      
      productsFormArray.push(auxProductsFormGroup)


      this.setTotalPurchaseMerchandise()


    })

    



    


    
  }


  formGroupHasError(index: number, formControlName: string, controlName: string, errorType:string) {    
    return (<FormArray>this.purchase_merchandice.get(formControlName)).controls[index].get(controlName)?.hasError(errorType) && (<FormArray>this.purchase_merchandice.get(formControlName)).controls[index].get(controlName)?.touched;
  }


  deleteProduct(index: number){

    Swal.fire({
      title: '¿Desea eliminar el producto de carrito?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let products = this.purchase_merchandice.controls.products as FormArray

        products.removeAt(index)

        if(products.length ==  0){
          this.purchase_merchandice.controls.total.setValue(0)
          this.purchase_merchandice.controls.subtotal.disable()
          this.purchase_merchandice.controls.iva.disable()

        } 
        
      } else if (result.isDenied) {

      }
    })


  }


  setPurchaseMerchandise(index: number, formControlName: string, controlName: string){

    let products = this.purchase_merchandice.controls.products as FormArray
    let ammount = (<FormArray>this.purchase_merchandice.get(formControlName)).controls[index].get(controlName)?.value;
    let hasMaxValueError =  (<FormArray>this.purchase_merchandice.get(formControlName)).controls[index].get(controlName)?.getError('max');

    
    //If ammount is biger than avaliabe ammount return
    if (hasMaxValueError) {
      return
    }

    //If ammount is not a integer number
   if( (ammount % 1) != 0){
      products.controls[index].get('amount')?.setValue(Math.round(ammount))
      ammount = Math.floor(ammount)
   }

    

    let price = products.controls[index].get('price')?.value;
    let total =  price * ammount
    let iva =  products.controls[index].get('iva')?.value;
    let subtotal = 0
    let iva_ammount = 0
     
    //If product has iva
    /*
    if(iva > 0){
      iva_ammount = (total * (iva/100)) 
      subtotal = total
      total = total + iva_ammount
    }else{
      subtotal = total
    }
    */
    

    products.controls[index].get('total')?.setValue(total)
    products.controls[index].get('subtotal')?.setValue(subtotal)


    //Set the tootal info about purchase_merchandise
    this.setTotalPurchaseMerchandise()
  }


  setTotalPurchaseMerchandise(){
    let products:any = this.purchase_merchandice.controls.products.value

    
    this.total = 0
    this.subtotal = 0
    this.iva_ammount = 0

    

    products.forEach((element:any) => {

        this.total = this.total + element.total
        this.subtotal +=  element.subtotal
        
    });

    if (this.iva_ammount != 0) {
      let iva_ammount =  ( this.subtotal * (this.iva_ammount/100) )
      this.total = this.total + iva_ammount
    }


    this.purchase_merchandice.controls.iva.setValue(this.iva_ammount)
    this.purchase_merchandice.controls.total.setValue(this.total)
    this.purchase_merchandice.controls.subtotal.setValue(this.subtotal)
      
  }


}
