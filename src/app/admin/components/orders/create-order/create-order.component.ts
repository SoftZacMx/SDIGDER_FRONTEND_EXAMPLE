import { BooleanInput } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, MinValidator } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';
import Swal from 'sweetalert2';
import { SelectUserComponent } from '../../generic/select-user/select-user.component';
import { SelectSaourceComponent } from '../../generic/select-saource/select-saource.component';
import { ISaource } from 'src/app/admin/interfaces/saources/saource.interface';
import { IOrder } from 'src/app/admin/interfaces/orders/order.interface';
import { OrdersService } from 'src/app/admin/services/orders/orders.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { CreateSaleTicketComponent } from '../../sale-ticket/create-sale-ticket/create-sale-ticket.component';
import { TablesService } from 'src/app/admin/services/tables/tables.service';
import { ITablesFilters } from 'src/app/admin/interfaces/tables/tables.filters.interface';
import { ITable } from 'src/app/admin/interfaces/tables/table.interface';
import { SelectTableComponent } from '../../generic/select-table/select-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ICategorySaource } from 'src/app/admin/interfaces/categories-saources/categories-saources-interface';
import { ICategorysSaourcesFilters } from 'src/app/admin/interfaces/categories-saources/categories-saources.filters.interface';
import { ISaourcesFilters } from 'src/app/admin/interfaces/saources/saources.filters.inerface';
import { CategoriesSaourcesService } from 'src/app/admin/services/categories-saources/categories-saources.service';
import { SaourcesService } from 'src/app/admin/services/saources/saources.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private userDataService: UserDataService,
    public dialog: MatDialog,
    private orderService: OrdersService,
    private tablesServices: TablesService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private saourceService:SaourcesService,
    private categoriesSaourcesService:CategoriesSaourcesService

  ) {


  }

  ngOnInit(): void {
    console.log('this.userDataService.getUserData()', this.userDataService.getUserData());
    this.getTables()

    this.activateRoute.paramMap
      .subscribe((params) => {

        this.order_id = parseInt(params.get('order_id'))

        params.get('edition') == 'true' ?
          this.edit_order = true :
          null

        params.get('creation') == 'true' ?
          this.create_order = true :
          null

        if (this.order_id > 0) {
          this.getOrderInfo()
          this.getSaourcesOrder()
        }




      })

      this.getSaources()
      this.getSaourcesCategories()

    //this.generateTickete(32)
  }

  origin_options = [
    {
      value: 'Local',
      decription: 'Local'
    },
    {
      value: 'Order',
      decription: 'Pedido'
    },
  ]

  date = moment().format('YYYY-MM-DD')
  user = this.formBuilder.control('', [Validators.required])
  product_name = ''
  agent: any = this.userDataService.getUserData()
  table = this.formBuilder.control('')
  order_id: number = 0

  edit_order: boolean = false
  create_order: boolean = false


  sale = this.formBuilder.group({
    user: this.formBuilder.control(0, [Validators.required]),
    products: this.formBuilder.array([], [Validators.required, Validators.min(1)]),
    total: this.formBuilder.control(0, [Validators.required, Validators.min(1)]),
    subtotal: this.formBuilder.control(0, [Validators.required, Validators.min(1)]),
    iva: this.formBuilder.control(0, [Validators.required, Validators.min(0)]),
    payment_method: this.formBuilder.control(0, [Validators.min(0), Validators.required, Validators.maxLength(1)]),
    payed: this.formBuilder.control({ value: 0, disabled: true }, [Validators.required, Validators.min(0)]),
    opening_cash_register_id: this.formBuilder.control(this.userDataService.getUserData().opening_cash_register_id, [Validators.required, Validators.min(1)]),
    delivered: this.formBuilder.control(false, [Validators.required]),
    table_number: this.formBuilder.control({ disabled: true, value: 0 }, [Validators.required, Validators.min(1)]),
    tip: this.formBuilder.control(0, [Validators.required, Validators.min(0)]),
    origin: this.formBuilder.control('Local', [Validators.required]),
    client: this.formBuilder.control({ value: '', disabled: true }),
    note: this.formBuilder.control('', [Validators.maxLength(500)]),
  })

  total: number = 0
  subtotal: number = 0
  iva_ammount: number = 0
  tip_ammount: number = 0
  change = this.formBuilder.control(0)
  delivered = this.formBuilder.control({ value: 0, disabled: true }, [Validators.required])
  rest_to_pay = this.formBuilder.control(0, [Validators.min(0), Validators.required])
  tables: ITable[] = []

  //DIALOGS

  openDialogSelectSaource(enterAnimationDuration: string, exitAnimationDuration: string): void {



    this.dialog.open(SelectSaourceComponent, {
      data: {
        multiple: true
      },
      width: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      closeOnNavigation: false
    }).afterClosed().subscribe((data) => {

      if (data == undefined) {
        return
      }



      this.setProductsArrayFormData(data)





      //this.setSaleData()

    })



  }


  openDialogSelectTable(enterAnimationDuration: string, exitAnimationDuration: string): void {



    this.dialog.open(SelectTableComponent, {
      data: {
        availability_status: true
      },
      width: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      closeOnNavigation: false
    }).afterClosed().subscribe((data) => {

      if (data == undefined) {
        return
      }



      this.table.setValue(`Mesa número ${data.number_table}`)
      this.sale.controls.table_number.setValue(data.id)



      //this.setSaleData()

    })



  }



  setTotal(index: number, formControlName: string, controlName: string) {

    let products = this.sale.controls.products as FormArray
    let ammount = (<FormArray>this.sale.get(formControlName)).controls[index].get(controlName)?.value;
    let hasMaxValueError = (<FormArray>this.sale.get(formControlName)).controls[index].get(controlName)?.getError('max');

    //If ammount is biger than avaliabe ammount return
    if (hasMaxValueError) {
      return
    }

    //If ammount is not a integer number
    if ((ammount % 1) != 0) {
      products.controls[index].get('ammount')?.setValue(Math.round(ammount))
      ammount = Math.floor(ammount)
    }



    let price = products.controls[index].get('price')?.value;
    let total = price * ammount
    let iva = products.controls[index].get('iva')?.value;
    let subtotal = 0
    let iva_ammount = 0

    //If product has iva

    if (iva > 0) {
      iva_ammount = (total * (iva / 100))
      subtotal = total
      total = total + iva_ammount
    } else {
      subtotal = total
    }


    products.controls[index].get('total')?.setValue(total)
    products.controls[index].get('total_iva_ammount')?.setValue(iva_ammount)
    products.controls[index].get('subtotal')?.setValue(subtotal)


    //Set the tootal info about sale
    this.setSaleData()
  }

  formGroupHasError(index: number, formControlName: string, controlName: string, errorType: string) {
    return (<FormArray>this.sale.get(formControlName)).controls[index].get(controlName)?.hasError(errorType) && (<FormArray>this.sale.get(formControlName)).controls[index].get(controlName)?.touched;
  }

  getMaxAmmountAvailable(index: number, formArrayName: string, controlName: string): number {
    let formControl = (<FormArray>this.sale.get(formArrayName)).controls[index].get(controlName);
    let maxError = formControl?.getError('max')

    return maxError.max



  }

  setProductsArrayFormData(data: any) {

    let productsArrayForm = this.sale.controls.products as FormArray

    console.log('setProductsArrayFormData data', data);


    data.forEach((new_product: any) => {

      let productFormGroupAux = this.formBuilder.group({
        id: this.formBuilder.control(new_product.id, [Validators.required]),
        name: this.formBuilder.control(new_product.name, [Validators.required]),
        price: this.formBuilder.control(new_product.price || new_product.unite_price, [Validators.required, Validators.min(1), Validators.pattern('[0-9.]*')]),
        ammount: this.formBuilder.control(new_product.amount || 1, [Validators.required, Validators.min(1), Validators.pattern('[0-9]*')]),
        iva: this.formBuilder.control(new_product.iva || 0),
        subtotal: this.formBuilder.control(new_product.price || new_product.unite_price, [Validators.required, Validators.min(1), Validators.pattern('[0-9.]*')]),
        total: this.formBuilder.control((new_product.price || new_product.unite_price), [Validators.required, Validators.min(1), Validators.pattern('[0-9.]*')]),
        total_iva_ammount: this.formBuilder.control(0),
        note: this.formBuilder.control(new_product.note, [Validators.maxLength(100)]),

      })

      productsArrayForm.push(productFormGroupAux)

    });






    this.sale.controls.table_number.enable()


    this.sale.controls.products.value.forEach((data: any, i: number) => {
      this.setTotal(i, 'products', 'ammount')
    })

    this.delivered.enable()



  }



  enableEditEelement(index: number): void {
    (this.sale.get('products') as FormArray).controls[index].get('price')?.enable()
  }

  deleteProduct(index: number) {

    Swal.fire({
      title: '¿Desea eliminar el producto de carrito?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let products = this.sale.controls.products as FormArray
        products.removeAt(index)

        if (products.length == 0) {
          this.sale.controls.payed.setValue(0)
          this.sale.controls.payed.disable()
          this.sale.controls.table_number.disable()

        }

        this.setSaleData()


      } else if (result.isDenied) {
      }
    })


  }

  setSaleData() {
    let products: any = this.sale.controls.products.value


    this.total = 0
    this.subtotal = 0
    this.iva_ammount = 0



    products.forEach((element: any) => {


      this.total = this.total + element.total
      this.subtotal += element.subtotal
      this.iva_ammount += element.total_iva_ammount
    });


    this.sale.controls.iva.setValue(this.iva_ammount)
    this.sale.controls.total.setValue(this.total)
    this.sale.controls.subtotal.setValue(this.subtotal)
    this.sale.controls.payed.setValidators([Validators.max(this.total), Validators.min(this.total)])

  }

  enableCreditPaymentMethod(): BooleanInput {
    let enable: boolean = false
    if ((this.delivered.value! == 0) || (this.delivered.value! < this.sale.controls.total.value!)) {
      enable = true
    }
    return enable
  }


  calculateChange() {
    let total = this.sale.controls.total.value!
    let delivered = this.delivered.value!
    let change = 0
    let payment_method = this.sale.controls.payment_method.value

    if ((delivered > 0) && (total > 0) && (delivered >= total && payment_method != 2)) {
      change = delivered - total
      this.change.setValue(change)
    } else {
      this.change.setValue(0)
    }


    this.delivered.addValidators([Validators.min(total)])
    this.calculateRestToPay()


  }

  calculateRestToPay() {


    let rest_to_pay = 0
    let total = this.sale.controls.total.value!
    let delivered = this.delivered.value!

    if (delivered < total) {
      rest_to_pay = total - delivered
      this.rest_to_pay.setValue(rest_to_pay)
    } else {
      this.rest_to_pay.setValue(0)
    }



  }

  create(): void {

    let order: IOrder = {
      date: moment().format('YYYY-MM-DD hh:mm:ss'),
      saources: this.sale.controls.products.value!,
      total: this.sale.controls.total.value!,
      subtotal: this.sale.controls.subtotal.value!,
      iva: this.sale.controls.iva.value!,
      status: false,
      user_id: parseInt(this.agent.id),
      cash_register_id: this.userDataService.getUserData().cash_register_id!,
      payment_method: this.sale.controls.payment_method.value!,
      opening_cash_register_id: this.sale.controls.opening_cash_register_id.value!,
      delivered: this.sale.controls.delivered.value!,
      table_number: this.sale.controls.table_number.value,
      tip: this.sale.controls.tip.value,
      origin: this.sale.controls.origin.value,
      client: this.sale.controls.client.value,
      payment_differ: false,
      note: ''
    }



    this.delivered.value! >= order.total ? order.status = true : order.status = false

    this.sale.controls.note.value == '' ?
      order.note = 'Sin nota' :
      order.note = this.sale.controls.note.value



    this.orderService.createOrder(order)
      .subscribe({

        next: (res: IResponse) => {

          if (res.result) {
            fireSuccessDialog('Orden creada con éxito')
            this.cleanForm()
            this.router.navigate(['/admin/orders'])

          }

        },

        error: (error: any) => {

          if (error.error.error) {
            switch (error.error.message) {
              case 'The order cannot be created because the assigned table is not available':
                fireErrorDialog('La orden no puede ser creada porque la mesa asignada no esta disponible')
                break;

              default:
                fireErrorDialog('Algo salio mal al tratar de insertar la orden')
                break;
            }
          }

        }




      })


  }



  cleanForm() {
    this.sale.controls.user.setValue(0)
    this.sale.controls.iva.setValue(0)
    this.sale.controls.payed.setValue(0)
    this.sale.controls.payment_method.setValue(2)
    this.sale.controls.products.clear()
    this.sale.controls.subtotal.setValue(0)
    this.sale.controls.total.setValue(0)
    this.delivered.setValue(0)
    this.rest_to_pay.setValue(0)
    this.change.setValue(0)
    this.user.setValue('')
    this.enableCreditPaymentMethod()
    this.total = 0





  }

  setPaymentMethod(method: number) {
    let actual_payment_method = this.sale.controls.payment_method.value

    switch (method) {
      case 1:
        this.rest_to_pay.setValue(this.total)
        this.delivered.setValue(0)
        this.sale.controls.payment_method.setValue(1)

        break;
      case 2:
        this.rest_to_pay.setValue(this.total)
        this.delivered.setValue(0)

        this.sale.controls.payment_method.setValue(2)

        break;
      default:
        this.rest_to_pay.setValue(this.total)
        this.delivered.setValue(0)
        this.sale.controls.payment_method.setValue(3)

        break;
    }
  }





  getTables(setLength?: boolean) {
    let filters: ITablesFilters = {
      user: 0,
      start_date: '',
      end_date: '',
      status: '',
      pageIndex: 0,
      pageSize: 0
    }

    this.tablesServices.getTables(filters)
      .subscribe({

        next: (res: any) => {

          if (res.result) {
            this.tables = res.data
          }

        },
        error: (res: any) => {
          console.log(' getTables error res', res);

          this.tables = []

        }


      })
  }

  clean(key: string) {
    switch (key) {
      case 'table':
        this.table.setValue('')
        this.sale.controls.table_number.setValue(0)
        break;
    }
  }

  addTip() {

    if (this.sale.controls.tip.value >= 0) {

      let tip = this.sale.controls.tip.value
      let total = this.sale.controls.total.value
      this.subtotal = this.total

      this.tip_ammount = (tip / 100) * total
      this.total = this.tip_ammount + total
      this.sale.controls.total.setValue(this.total)
      this.sale.controls.subtotal.setValue(this.subtotal)

    }


  }


  getOrderInfo() {
    this.orderService.getOrder(this.order_id)
      .subscribe({
        next: (res: IResponse) => {
          console.log('getOrder next res', res);
          if (res.result) {
            this.sale.controls.total.setValue(res.data[0].total)
            this.sale.controls.table_number.setValue(res.data[0].assigned_table)
            this.table.setValue(res.data[0].assigned_table)


          }

        },
        error: (error: any) => {
          console.log('getOrder error error', error);

        }
      })
  }

  getSaourcesOrder() {
    this.orderService.getSaourcesOrder(this.order_id)
      .subscribe({
        next: (res: IResponse) => {
          console.log('getSaourcesOrder next res', res);
          if (res.result) {
            this.setProductsArrayFormData(res.data)
          }

        },
        error: (error: any) => {
          console.log('getSaourcesOrder error error', error);

        }
      })
  }


  deleteSaourceFromOrder(saource_id: number) {

    this.orderService.deleteSaourceOfOrder(this.order_id, saource_id)
      .subscribe({

        next: (res: IResponse) => {


          console.log('deleteSaourceOfOrder next res ', res);


          if (res.result) {

            fireSuccessDialog('Producto eliminado con éxito')
            this.cleanForm()
            this.getOrderInfo()
            this.getSaourcesOrder()

          }

        },

        error: (error: any) => {
          console.log('deleteSaourceOfOrder error res ', error);

        }

      })





  }


  evaluateOrigin() {

    let origin = this.sale.controls.origin.value

    if (origin == 'Order') {
      this.sale.controls.client.addValidators(Validators.required)
      this.sale.get('client').updateValueAndValidity()

      this.sale.controls.table_number.removeValidators(Validators.required)
      this.sale.controls.table_number.setValidators(Validators.min(0))
      this.sale.controls.table_number.setValue(0)
      this.sale.get('table_number').updateValueAndValidity()

      this.table.setValue('')
      this.table.disable()
      this.sale.controls.client.enable()


    } else {

      this.sale.controls.table_number.setValidators([Validators.required, Validators.min(1)])
      this.sale.controls.table_number.setValue(0)
      this.sale.get('table_number').updateValueAndValidity()

      this.sale.controls.client.removeValidators(Validators.required)
      this.sale.get('client').updateValueAndValidity()
      this.sale.controls.client.setValue('')
      this.sale.controls.client.disable()

    }



  }


  //FILTRES FOR SAOURCES LOGIC

    filter_applyed:string = ''
    saource_name:string = ''
    saources:ISaource[] = []
    saources_categories:ICategorySaource[] = []
    filters:ISaourcesFilters = {
      status: '',
      pageIndex: 0,
      pageSize: 0,
      category:0
    }
  
    categoriesSaourcesFilters:ICategorysSaourcesFilters = {
      start_date: '',
      end_date: '',
      pageSize: 0,
      pageIndex: 0,
      status: ''
    }
    
  
    getSaources(){
      const filters = this.filters
      this.saourceService.getSaourcesMenu(filters)
        .subscribe({
          next: (res:IResponse) => {
            console.log('saources-card getSaources next res',res);
              if (res.result) {
                this.saources = res.data
              }
          },
          error: (error:any) => {
            console.log('saources-card getSaources error error',error);
            this.saources = []
          }
        })
    }
  
    getSaourcesCategories(){
      const filters = this.categoriesSaourcesFilters
      this.categoriesSaourcesService.getSaourcesCategoriesMenu(filters)
        .subscribe({
          next: (res:IResponse) => {
            console.log('saources-card getSaourcesCategories next res',res);
              if (res.result) {
                this.saources_categories = res.data
              }
          },
          error: (error:any) => {
            console.log('saources-card getSaourcesCategories error error',error);
            Swal.fire('Error','Ocurrio un error al tratar de obtener las categorias de los platillos','error')
          }
        })
    }
  
    applyFilters(category:number){
      
      this.getCategoryName(category)
      this.filters.category = category
      this.getSaources()
      
    }
  
    getCategoryName(category_id:number){
      
      if (category_id == 0) {
          this.filter_applyed = 'Todas las categorías'
          return
      }
  
      const category_found = this.saources_categories.find((category:ICategorySaource  ) => {
        return category.id == category_id
      })
      if (category_found != undefined) {
        this.filter_applyed = category_found.name
      }
      
    }

}
