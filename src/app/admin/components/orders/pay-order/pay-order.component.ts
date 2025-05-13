import { BooleanInput } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, MinValidator } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';
import Swal from 'sweetalert2';
import { SelectSaourceComponent } from '../../generic/select-saource/select-saource.component';
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
@Component({
  selector: 'app-pay-order',
  templateUrl: './pay-order.component.html',
  styleUrls: ['./pay-order.component.css']
})
export class PayOrderComponent {


  constructor(
    private formBuilder: FormBuilder,
    private userDataService: UserDataService,
    public dialog: MatDialog,
    private orderService: OrdersService,
    private tablesServices: TablesService,
    private activateRoute: ActivatedRoute,
    private router: Router

  ) {


  }

  ngOnInit(): void {

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

    //this.generateTickete(32)
  }

  date = moment().format('YYYY-MM-DD')
  user = this.formBuilder.control('', [Validators.required])
  product_name = ''
  agent: any = this.userDataService.getUserData()
  table = this.formBuilder.control({ value: '', disabled: true })
  order_id: number = 0

  edit_order: boolean = false
  create_order: boolean = false

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


  sale = this.formBuilder.group({
    user: this.formBuilder.control(0, [Validators.required]),
    products: this.formBuilder.array([], [Validators.required, Validators.min(1)]),
    total: this.formBuilder.control(0, [Validators.required, Validators.min(1)]),
    subtotal: this.formBuilder.control(0, [Validators.required, Validators.min(1)]),
    iva: this.formBuilder.control(0, [Validators.required, Validators.min(0)]),
    payment_method: this.formBuilder.control(0, [Validators.min(1), Validators.required]),
    payed: this.formBuilder.control({ value: 0, disabled: true }, [Validators.required, Validators.min(1)]),
    opening_cash_register_id: this.formBuilder.control(this.userDataService.getUserData().opening_cash_register_id, [Validators.required, Validators.min(1)]),
    delivered: this.formBuilder.control(false, [Validators.required, Validators.min(1)]),
    table_number: this.formBuilder.control({ disabled: true, value: 0 }, [Validators.required, Validators.min(1)]),
    tip: this.formBuilder.control({ disabled: true, value: 0 }, [Validators.required, Validators.min(0)]),
    origin: this.formBuilder.control({ disabled: true, value: '' }, [Validators.required]),
    client: this.formBuilder.control({ disabled: true, value: '' }),
    differ_payment: this.formBuilder.control(false),

    first_payment_differ_payment_method: this.formBuilder.control(0, [Validators.min(0)]),
    first_payment_differ_delivered: this.formBuilder.control(0, [Validators.min(0)]),
    first_payment_differ_rest_to_pay: this.formBuilder.control(0, [Validators.min(0)]),

    second_payment_differ_rest_to_pay: this.formBuilder.control({ disabled: true, value: 0 }, [Validators.min(1)]),
    second_payment_differ_payment_method: this.formBuilder.control({ disabled: true, value: 0 }, [Validators.min(0)]),
    second_payment_differ_payment_delivered: this.formBuilder.control({ disabled: true, value: 0 }, [Validators.min(0)]),

    note: this.formBuilder.control('',[Validators.maxLength(500)]),

  })

  total: number = 0
  subtotal: number = 0
  iva_ammount: number = 0
  tip_ammount: number = 0
  change = this.formBuilder.control({ value: 0, disabled: true })
  delivered = this.formBuilder.control({ value: 0, disabled: true }, [Validators.required,Validators.min(this.sale.controls.total.value)])
  rest_to_pay = this.formBuilder.control({ value: 0, disabled: true }, [Validators.min(0), Validators.required])
  tables: ITable[] = []
  differ_options = [
    {
      description: 'Si',
      value: true
    },
    {
      description: 'No',
      value: false
    },

  ]

  payment_options = [
    {
      description: 'Efectivo',
      value: 1
    },
    {
      description: 'Transferencia',
      value: 2
    },
    {
      description: 'Tarjeta',
      value: 3
    },


  ]

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
      data: {},
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



    if (this.sale.controls.products.value.length > 0) {

      let producstArrayFormValue = this.sale.controls.products.value

      data.forEach((new_product: any) => {

        let exist: boolean = false

        producstArrayFormValue.map((product: any) => {

          if (product.id == new_product.id) {
            exist = true
          }

        })



        if (!exist) {
          let productFormGroupAux = this.formBuilder.group({
            id: this.formBuilder.control(new_product.id, [Validators.required]),
            name: this.formBuilder.control(new_product.name, [Validators.required]),
            price: this.formBuilder.control({ value: new_product.unite_price, disabled: true }, [Validators.required, Validators.min(1), Validators.pattern('[0-9.]*')]),
            ammount: this.formBuilder.control(new_product.amount ? new_product.amount : 1, [Validators.required, Validators.min(1), Validators.pattern('[0-9]*'), Validators.min(1)]),
            iva: this.formBuilder.control(new_product.iva  ? new_product.iva : 0),
            subtotal: this.formBuilder.control(new_product.price, [Validators.required, Validators.min(1), Validators.pattern('[0-9.]*')]),
            total: this.formBuilder.control((new_product.price), [Validators.required, Validators.min(1), Validators.pattern('[0-9.]*')]),
            total_iva_ammount: this.formBuilder.control(0),
            note: this.formBuilder.control(new_product.note, [Validators.maxLength(100)]),

          })
          productsArrayForm.push(productFormGroupAux)
        } else {

        }






      })

    } else {
      data.forEach((new_product: any) => {
        let productFormGroupAux = this.formBuilder.group({
          id: this.formBuilder.control(new_product.id, [Validators.required]),
          name: this.formBuilder.control(new_product.name, [Validators.required]),
          price: this.formBuilder.control({ value: new_product.unite_price, disabled: true }, [Validators.required, Validators.min(1), Validators.pattern('[0-9.]*')]),
          ammount: this.formBuilder.control(new_product.amount ? new_product.amount : 1, [Validators.required, Validators.min(1), Validators.pattern('[0-9]*')]),
          iva: this.formBuilder.control(new_product.iva  ? new_product.iva : 0),
          subtotal: this.formBuilder.control(new_product.price, [Validators.required, Validators.min(1), Validators.pattern('[0-9.]*')]),
          total: this.formBuilder.control((new_product.price), [Validators.required, Validators.min(1), Validators.pattern('[0-9.]*')]),
          total_iva_ammount: this.formBuilder.control(0),
          note: this.formBuilder.control(new_product.note, [Validators.maxLength(100)]),

        })

        productsArrayForm.push(productFormGroupAux)

      });

    }




    this.sale.controls.table_number.enable()


    this.sale.controls.products.value.forEach((data: any, i: number) => {
      this.setTotal(i, 'products', 'ammount')
    })


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

    if ((delivered > 0) && (total > 0) && (delivered >= total && payment_method == 1)) {

      change = delivered - total
      change = Math.floor(change)
      this.change.setValue(change)
    } else {
      this.change.setValue(0)
    }


    this.delivered.setValidators([Validators.min(total)])

    if (this.sale.controls.payment_method.value == 2 || this.sale.controls.payment_method.value == 3) {      
      this.delivered.addValidators([Validators.max(this.sale.controls.total.value)])

    }else{
      this.delivered.removeValidators([Validators.max(this.sale.controls.total.value)])

    }

    this.delivered.updateValueAndValidity()

    this.calculateRestToPay()


  }

  calculateRestToPay() {

    let rest_to_pay = 0
    let total = this.sale.controls.total.value!
    let delivered = this.delivered.value!
    let payment_method =  this.sale.controls.payment_method.value

    if ((delivered > total) && (payment_method == 2 || payment_method ==3 )) {
      return
    }

    if (delivered < total) {
      rest_to_pay = total - delivered
      this.rest_to_pay.setValue(rest_to_pay)
    } else {
      this.rest_to_pay.setValue(0)
    }



  }

  pay(): void {
        
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
      tip: this.tip_ammount,
      origin: this.sale.controls.origin.value,
      client: this.sale.controls.client.value,

      payment_differ: this.sale.controls.differ_payment.value,

      first_payment_payment_method: this.sale.controls.first_payment_differ_payment_method.value,
      first_payment_amount: this.sale.controls.first_payment_differ_delivered.value,
  
      second_payment_payment_method: this.sale.controls.second_payment_differ_payment_method.value,
      second_payment_amount: this.sale.controls.second_payment_differ_payment_delivered.value,

      note:this.sale.controls.note.value
      
    }

    this.delivered.value! >= order.total ?
      order.status = true :
      order.status = false

    if (order.origin == 'Local' && order.status == true) {
      order.delivered = true
    }
    
    this.orderService.payOrder(this.order_id,order)
      .subscribe({

        

        next: (res: IResponse) => {

          console.log('createOrder next res', res);


          if (res.result) {
            fireSuccessDialog('Orden pagada con éxito')
            this.generateTickete(this.order_id)
            this.cleanForm()
            this.router.navigate(['/admin/orders'])

          }

        },

        error: (error: any) => {

          console.log('createOrder error res', error);


          if (error.error) {
            fireErrorDialog('Algo salio mal al tratar de insertar la orden')
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

  setPaymentMethod() {

    this.delivered.setValue(0)
    this.rest_to_pay.setValue(0)
    this.sale.controls.tip.setValue(0)
    this.change.setValue(0)

    this.setSaleData()
    this.rest_to_pay.setValue(this.total)

    this.delivered.enable()
    this.rest_to_pay.enable()
    this.sale.controls.tip.enable()
    this.change.enable()

    this.delivered.setValidators([Validators.min(this.sale.controls.total.value)])

    this.delivered.updateValueAndValidity()

  }


  generateTickete(order_id: number) {

    this.dialog.open(CreateSaleTicketComponent, {
      data: {
        order_id: order_id
      },
      width: '500px',
      height: '700px',
      enterAnimationDuration: 500,
      exitAnimationDuration: 500,
      closeOnNavigation: false
    }).afterClosed().subscribe((data) => {

    })


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

          console.log('getTables next res', res);

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

    this.setSaleData()

    if (this.sale.controls.tip.value >= 0) {

      let tip = this.sale.controls.tip.value
      let total = this.sale.controls.total.value
      this.subtotal = this.total

      this.tip_ammount = Math.ceil((tip / 100) * total)
      this.total = this.tip_ammount + total

      this.sale.controls.total.setValue(this.total)
      this.sale.controls.subtotal.setValue(this.subtotal)
      this.rest_to_pay.setValue(this.sale.controls.total.value)


    }
    
    
    this.delivered.setValue(0)


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
            this.sale.controls.origin.setValue(res.data[0].origin)
            this.sale.controls.client.setValue(res.data[0].client)
            if (res.data[0].origin == 'Order') {
              this.sale.get('table_number').setValidators([Validators.min(0)])
              this.sale.get('table_number').updateValueAndValidity()

            }
            this.sale.controls.note.setValue(res.data[0].note)

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
  

  //DIFFER PAYMENT
  differCalculateRestToPay() {

    //If the first differ delivered amount or the second differ delivered amount are empty or equal 0
    if ((this.sale.controls.first_payment_differ_delivered.value > 0)) {

      let total = this.sale.controls.total.value
      let first_payment_differ_delivered = this.sale.controls.first_payment_differ_delivered.value


      let second_payment_differ_rest_to_pay = total - first_payment_differ_delivered
      this.sale.controls.second_payment_differ_rest_to_pay.setValue(second_payment_differ_rest_to_pay)

      //Add new max amount and minial ammount at the second differ payment section and updte the control
      this.sale.get('second_payment_differ_payment_delivered').setValidators([Validators.max(second_payment_differ_rest_to_pay), Validators.min(second_payment_differ_rest_to_pay)])
      this.sale.get('second_payment_differ_payment_delivered').updateValueAndValidity()




      //Enable second differ payment controls
      this.sale.controls.second_payment_differ_payment_method.enable()
      this.sale.controls.second_payment_differ_rest_to_pay.enable()
      this.sale.controls.second_payment_differ_payment_delivered.enable()

    }




  }

  setDifferPaymentOption() {

    let differ_payment = this.sale.controls.differ_payment.value

    if (differ_payment == false) {

      //Set minimal value to 1 and make the control as requried
      this.sale.controls.payment_method.setValidators([Validators.required, Validators.min(1)])
      this.sale.controls.payment_method.updateValueAndValidity()

      this.sale.get('payed').setValidators([Validators.required, Validators.min(this.sale.controls.total.value)])
      this.sale.get('payed').updateValueAndValidity()
      this.sale.get('payed').setValue(0)

      this.sale.controls.first_payment_differ_delivered.setValue(0)
      this.sale.controls.first_payment_differ_payment_method.setValue(0)
      this.sale.controls.first_payment_differ_rest_to_pay.setValue(0)

      this.sale.controls.second_payment_differ_payment_delivered.setValue(0)
      this.sale.controls.second_payment_differ_payment_method.setValue(0)
      this.sale.controls.second_payment_differ_rest_to_pay.setValue(0)

            //Update the validators of first payment differ
            this.sale.get('first_payment_differ_delivered').setValidators([Validators.min(0), Validators.required]);
            this.sale.get('first_payment_differ_delivered').updateValueAndValidity()
      
            this.sale.get('first_payment_differ_payment_method').setValidators([Validators.min(0), Validators.required]);
            this.sale.get('first_payment_differ_payment_method').updateValueAndValidity()
      
            this.sale.get('first_payment_differ_rest_to_pay').setValidators([Validators.min(0), Validators.required]);
            this.sale.get('first_payment_differ_rest_to_pay').updateValueAndValidity()
      
            //Update the validators of  Second payment differ
            this.sale.get('second_payment_differ_payment_delivered').setValidators([Validators.min(0), Validators.required]);
            this.sale.get('second_payment_differ_payment_delivered').updateValueAndValidity()
      
            this.sale.get('second_payment_differ_payment_method').setValidators([Validators.min(0), Validators.required]);
            this.sale.get('second_payment_differ_payment_method').updateValueAndValidity()
      
            this.sale.get('second_payment_differ_rest_to_pay').setValidators([Validators.min(0), Validators.required]);
            this.sale.get('second_payment_differ_rest_to_pay').updateValueAndValidity()
      
      




      this.sale.controls.payment_method.setValue(0)


      //total_differ_delivered
    } else {
      //Update validators of payment method to minimal value at 0 and update the form control status
      this.sale.get('payment_method').setValidators([Validators.min(0)]);
      this.sale.get('payment_method').updateValueAndValidity()

      this.delivered.setValidators([Validators.min(0)])
      this.delivered.setValue(0)
      this.delivered.updateValueAndValidity()
      
      //Update the validators of first payment differ
      this.sale.get('first_payment_differ_delivered').setValidators([Validators.min(1), Validators.required,Validators.max(this.sale.controls.total.value - 1)]);
      this.sale.get('first_payment_differ_delivered').updateValueAndValidity()

      this.sale.get('first_payment_differ_payment_method').setValidators([Validators.min(1), Validators.required]);
      this.sale.get('first_payment_differ_payment_method').updateValueAndValidity()

      this.sale.get('first_payment_differ_rest_to_pay').setValidators([Validators.min(1), Validators.required]);
      this.sale.get('first_payment_differ_rest_to_pay').updateValueAndValidity()

      /*
          second_payment_differ_rest_to_pay: this.formBuilder.control({ disabled: true, value: 0 }, [Validators.min(1)]),
    second_payment_differ_payment_method: this.formBuilder.control({ disabled: true, value: 0 }, [Validators.min(0)]),
    second_payment_differ_payment_delivered: this.formBuilder.control({ disabled: true, value: 0 }, [Validators.min(0)]),


      */
      //Update the validators of  Second payment differ
      this.sale.get('second_payment_differ_payment_delivered').setValidators([Validators.min(1), Validators.required]);
      this.sale.get('second_payment_differ_payment_delivered').updateValueAndValidity()

      this.sale.get('second_payment_differ_payment_method').setValidators([Validators.min(1), Validators.required]);
      this.sale.get('second_payment_differ_payment_method').updateValueAndValidity()

      this.sale.get('second_payment_differ_rest_to_pay').setValidators([Validators.min(1), Validators.required]);
      this.sale.get('second_payment_differ_rest_to_pay').updateValueAndValidity()


    }

  }

  calculateTotalDifferAmountDelivered(){

        let first_payment_differ_delivered = this.sale.controls.first_payment_differ_delivered.value
        let second_payment_differ_payment_delivered = this.sale.controls.second_payment_differ_payment_delivered.value
        let total_differ_delivered = first_payment_differ_delivered + second_payment_differ_payment_delivered
    
    
        this.sale.controls.payed.setValue(total_differ_delivered)
        this.delivered.setValue(total_differ_delivered)
            
  }

}
