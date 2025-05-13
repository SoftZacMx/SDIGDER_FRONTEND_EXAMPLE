import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectUserComponent } from '../../generic/select-user/select-user.component';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { ProductCreationComponent } from '../product-creation/product-creation.component';
import { IProductsFitlers } from 'src/app/admin/interfaces/products/products.filters.interface';
import { retry } from 'rxjs';
import { ProductsService } from 'src/app/admin/services/products/products.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { IProducts } from 'src/app/admin/interfaces/products/product.interface';
import { PageEvent } from '@angular/material/paginator';
import * as moment from 'moment';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { EditUserComponent } from '../../users/edit-user/edit-user.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private productsService: ProductsService
  ) { }


  ngOnInit(): void {
    this.getTotalLength()
    this.getProducts()
  }


  status_options = [
    {
      value: 'true',
      description: 'Activo'
    },
    {
      value: 'false',
      description: 'Inactivo'
    },
    {
      value: '',
      description: 'Todos'
    }

  ]

  filters: IProductsFitlers = {
    user: 0,
    start_date: '',
    end_date: '',
    status: '',
    pageIndex: 0,
    pageSize: 0
  }

  user: string = ''
  product_name: string = ''
  products: IProducts[] = []


  //PAGINATOR
  pageSizeOptions = [2, 5, 10, 25];
  length = 0
  pageSize = 10;
  pageIndex = 0;

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent = new PageEvent;

  handlePageEvent(e: PageEvent) {

    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.filters.pageIndex = this.pageIndex
    this.filters.pageSize = this.pageSize

    this.getProducts()

  }

  // FILTERS

  //Clean inputs filters
  clean(key: string) {
    switch (key) {
      case 'user':
        this.filters.user = 0
        this.user = ''
        break;
      case 'start_date':
        this.filters.start_date = ''
        break;
      case 'end_date':
        this.filters.end_date = ''
        break;
      default:
        break;
    }
  }

  //Filters dialogs
  openDialogSelectUser(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SelectUserComponent, {
      data: {},
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe((data: IUser) => {

      if (data == null) {
        return
      }

      this.filters.user = data.id!
      this.user = `${data.name} ${data.last_name} ${data.second_last_name}`


    })
  }

  //Clean filter
  cleanFilters() {
    this.filters.user = 0
    this.user = ''
    this.filters.start_date = ''
    this.filters.end_date = ''
  }

  //Create filters
  createFilters() {

    let filters: IProductsFitlers = {
      user: 0,
      start_date: '',
      end_date: '',
      status: '',
      pageIndex: 0,
      pageSize: 0
    }


    this.filters.start_date != '' ?
      filters.start_date = moment(this.filters.start_date).format('YYYY-MM-DD 00:00:00') : null

    this.filters.end_date != '' ?
      filters.end_date = moment(this.filters.end_date).format('YYYY-MM-DD 23:59:59') : null

    this.filters.pageIndex != 0 ?
      filters.pageIndex = this.filters.pageIndex : null

    this.filters.pageSize != 0 ?
      filters.pageSize = this.filters.pageSize : null

    this.filters.status != '' ?
      filters.status = this.filters.status : null

    this.filters.user != 0 ?
      filters.user = this.filters.user : null

    return filters
  }


  // NEW PRODUCT

  //Open dialog create product
  openDialogNewProduct(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ProductCreationComponent, {
      data: {},
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe(() => {

      this.cleanFilters()
      this.getTotalLength()
      this.getProducts()

    })
  }


  //EDIT PRODUCT

  //Open dialog edit product
  openDialogEditProduct(enterAnimationDuration: string, exitAnimationDuration: string, product: IProducts): void {
    this.dialog.open(EditProductComponent, {
      data: {
        product: product
      },
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe((data: IUser) => {

      this.cleanFilters()
      this.getTotalLength()
      this.getProducts()

    })
  }


  //DELETE PRODUCT

  //Open dialog delete product
  deleteProduct( product_id: number): void {
    Swal.fire({
      title: "¿Desea eliminar el producto?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.productsService.removeProduct(product_id)
          .subscribe({
            next: (res:IResponse) => {
              console.log('removeProduct next res');
              if (res.result) {
                fireSuccessDialog('Producto elimnado con éxito')
                this.cleanFilters()
                this.getTotalLength()
                this.getProducts()
              }
            },
            error: () => {
              fireErrorDialog('Ocurrio un error al tratar de eliminar el producto')
            }
          })
      } else if (result.isDenied) {
      }
    });
  }


  // GET DATA

  //Get al products
  getProducts() {

    let filters = this.createFilters()

    this.productsService.getProducts(filters)
      .subscribe({
        next: (res: IResponse) => {

          console.log('getProducts next res', res);

          if (res.result) {
            this.products = res.data
          }

        },
        error: (error: any) => {
          console.log('getProducts error error', error);
        }
      })


  }

  //Search products
  search() {
    this.getTotalLength()
    this.getProducts()
  }


  //AUX METHODS

  //Get the total length
  getTotalLength() {

    let filters = this.createFilters()
    filters.pageIndex = 0
    filters.pageSize = 0

    this.productsService.getProducts(filters)
      .subscribe({
        next: (res: IResponse) => {

          console.log('getProducts next res', res);

          if (res.result) {

            this.length = res.data.length
          }

        },
        error: (error: any) => {
          console.log('getProducts error error', error);
          if (error.error) {

            switch (error.error.message) {
              case 'Products was not selected':
                this.products = []
                break;

              default:
                fireErrorDialog('Algo salío mal al tratar de obtener los productos')
                break;
            }

          }
        }
      })

  }





}
