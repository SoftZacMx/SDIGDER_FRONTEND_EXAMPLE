import { Component, OnInit } from '@angular/core';
import { SelectUserComponent } from '../../generic/select-user/select-user.component';
import { MatDialog } from '@angular/material/dialog';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { IPurchaseMerchandiseFiltersInterface } from 'src/app/admin/interfaces/purchase_merchandise/purchase_merchandise.filters.interface';
import * as moment from 'moment';
import { PurchaseMerchandiseService } from 'src/app/admin/services/purchase-merchandise/purchase-merchandise.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { IPurchaseMerchandiseInterface } from 'src/app/admin/interfaces/purchase_merchandise/purchase_merchandise.interface';
import { PageEvent } from '@angular/material/paginator';
import { EditMerchandisePurchaseComponent } from '../edit-merchandise-purchase/edit-merchandise-purchase.component';
import Swal from 'sweetalert2';
import { CreateMerchandisePurchaseComponent } from '../create-merchandise-purchase/create-merchandise-purchase.component';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { PurchaseMerchandiseDetailComponent } from '../purchase-merchandise-detail/purchase-merchandise-detail.component';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';

@Component({
  selector: 'app-list-merchandise-purchase',
  templateUrl: './list-merchandise-purchase.component.html',
  styleUrls: ['./list-merchandise-purchase.component.css']
})
export class ListMerchandisePurchaseComponent implements OnInit {



  constructor(
    private dialog: MatDialog,
    private purchaseMerchandiseService: PurchaseMerchandiseService,
    private userDataService:UserDataService
  ) { }

  ngOnInit(): void {
    this.getMerchandisePurchase(true)
    this.rol = this.userDataService.getUserData().rol
  }

  filters: IPurchaseMerchandiseFiltersInterface = {
    payment_method: 0,
    user: 0,
    start_date: '',
    end_date: '',
    pageIndex: 0,
    pageSize: 0
  }

  rol:string = ''

  user: string = ''
  merchandises_purchase: IPurchaseMerchandiseInterface[] = []

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

    this.purchaseMerchandiseService.getMerchandisesPurchase(this.filters)
      .subscribe({

        next: (res: IResponse) => {
          console.log('getMerchandisesPurchase next res', res);
          if (res.result) {
            this.merchandises_purchase = res.data
          }

        },
        error: (error: any) => {
          console.log('getMerchandisesPurchase error res', error);
          if (error.error, error) {

          }

        }
      })


  }

  //OPEN SELECT USER
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


  //OPEN DIALOG EDIT PURCHASE MERCHANDISE
  openDialogEditPurchaseMerchandise(enterAnimationDuration: string, exitAnimationDuration: string, purchase: IPurchaseMerchandiseInterface): void {
    this.dialog.open(EditMerchandisePurchaseComponent, {
      data: {
        purchase_merchandise: purchase
      },
      width: '850px',
      height: '650px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe(() => {

      this.filters.start_date = ''
      this.filters.end_date = ''
      this.filters.pageIndex = 0
      this.filters.pageSize = 0
      this.filters.user = 0

      this.getMerchandisePurchase(true)



    })
  }

  //OPEN DIALOG EDIT PURCHASE MERCHANDISE
  openDialogCreatePurchaseMerchandise(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CreateMerchandisePurchaseComponent, {
      data: {},
      width: '700px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe(() => {

      this.filters.start_date = ''
      this.filters.end_date = ''
      this.filters.pageIndex = 0
      this.filters.pageSize = 0
      this.filters.user = 0

      this.getMerchandisePurchase(true)


    })
  }

  //OPEN DIALOG VIEW PURCHASE MERCHANDISE DETAIL
  openDialogViewPurchaseMerchandiseDetail(enterAnimationDuration: string, exitAnimationDuration: string, purchase: IPurchaseMerchandiseInterface): void {
    this.dialog.open(PurchaseMerchandiseDetailComponent, {
      data: {
        purchase_merchandise: purchase
      },
      width: '600px',
      height: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe(() => {

      this.filters.start_date = ''
      this.filters.end_date = ''
      this.filters.pageIndex = 0
      this.filters.pageSize = 0
      this.filters.user = 0

      this.getMerchandisePurchase(true)



    })
  }




  //DELETE PURCHASE MERCHANDICE
  deletePurchaseMerchandise(purchase_id: number) {

    Swal.fire({
      title: "¿Desea eliminar la compra?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.purchaseMerchandiseService.deletePurchaseMerchandise(purchase_id)
          .subscribe({

            next: (res: IResponse) => {

              console.log('deletePurchaseMerchandise next res', res);

              if (res.result) {
                fireSuccessDialog('Compra eliminado con éxito')

                this.filters.start_date = ''
                this.filters.end_date = ''
                this.filters.pageIndex = 0
                this.filters.pageSize = 0
                this.filters.user = 0

                this.getMerchandisePurchase(true)


              }

            },
            error: (res: any) => {

              console.log('deletePurchaseMerchandise error res', res);

              fireErrorDialog('Error al tratar de eliminar la compra')


            }
          })

      } else if (result.isDenied) {
      }
    });


  }


  //CLEAN INPUTS FILTERS
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

  createFilters(): IPurchaseMerchandiseFiltersInterface {

    let filters: IPurchaseMerchandiseFiltersInterface = {
      payment_method: 0,
      user: 0,
      start_date: '',
      end_date: '',
      pageIndex: 0,
      pageSize: 0
    }

    this.filters.user == 0 ?
      null :
      filters.user = this.filters.user

    this.filters.payment_method == 0 ?
      null :
      filters.payment_method = this.filters.payment_method


    this.filters.start_date == '' ?
      null :
      filters.start_date = moment(this.filters.start_date).format('YYYY-MM-DD 00:00:00')

    this.filters.end_date == '' ?
      null :
      filters.end_date = moment(this.filters.end_date).format('YYYY-MM-DD 23:59:59')

    this.filters.pageIndex == 0 ?
      null :
      filters.pageIndex = this.filters.pageIndex

    this.filters.pageSize == 0 ?
      null :
      filters.pageSize = this.filters.pageSize


    return filters
  }

  //SEARCH
  search() {
    let changeLength = true
    this.getMerchandisePurchase(changeLength)
  }


  getMerchandisePurchase(setLength?: boolean) {
    let filters = this.createFilters()
    this.purchaseMerchandiseService.getMerchandisesPurchase(filters)
      .subscribe({

        next: (res: IResponse) => {
          console.log('getMerchandisesPurchase next res', res);
          if (res.result) {
            this.merchandises_purchase = res.data
            setLength == true ? this.length = res.data.length : null
          }

        },
        error: (error: any) => {
          console.log('getMerchandisesPurchase error res', error);
          if (error.error, error) {
            this.merchandises_purchase = []
          }

        }
      })
  }





}
