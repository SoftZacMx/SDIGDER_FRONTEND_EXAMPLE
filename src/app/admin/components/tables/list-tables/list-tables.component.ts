import { Component, OnInit } from '@angular/core';
import { ITablesFilters } from 'src/app/admin/interfaces/tables/tables.filters.interface';
import { SelectUserComponent } from '../../generic/select-user/select-user.component';
import { MatDialog } from '@angular/material/dialog';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { PageEvent } from '@angular/material/paginator';
import { TablesService } from 'src/app/admin/services/tables/tables.service';
import { ITable } from 'src/app/admin/interfaces/tables/table.interface';
import { CreateTableComponent } from '../create-table/create-table.component';
import { EditTableComponent } from '../edit-table/edit-table.component';
import Swal from 'sweetalert2';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { IFiltersReports } from 'src/app/admin/interfaces/reports/report.filters.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-list-tables',
  templateUrl: './list-tables.component.html',
  styleUrls: ['./list-tables.component.css']
})
export class ListTablesComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private tablesService: TablesService
  ) {

  }

  ngOnInit(): void {
    this.filters.pageSize = 0
    this.getTotalLength();

    this.filters.pageSize = 10
    this.getTables(false)
  }

  tables: ITable[] = []

  filters: ITablesFilters = {
    user: 0,
    start_date: '',
    end_date: '',
    status: '',
    pageIndex: 0,
    pageSize: 10
  }

  status_options = [
    {
      value: 'true',
      description: 'Activa'
    },
    {
      value: 'false',
      description: 'Inactiva'
    },
    {
      value: '',
      description: 'Todas'
    }
  ]

  user: string = ''

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

    this.tablesService.getTables(this.filters)
      .subscribe({

        next: (res: any) => {
          if (res.result) {
            this.tables = res.data
          }

        },
        error: (res: any) => {
          console.log('handlePageEvent getTables error res', res);



        }


      })
  }

  search() {
    this.getTotalLength()
    this.filters.pageIndex = 0
    this.filters.pageSize = 10
    this.getTables(false)
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


  getTables(setLength?: boolean) {
    let filters = this.createFilters()
    this.tablesService.getTables(filters)
      .subscribe({

        next: (res: any) => {

          console.log('getTables next res', res);

          if (res.result) {
            this.tables = res.data
            setLength == true ? this.length = res.data.length : null
          }

        },
        error: (res: any) => {
          console.log(' getTables error res', res);

          this.tables = []

        }


      })
  }


  getTotalLength() {
    let filters = this.createFilters()
    this.tablesService.getTables(filters)
      .subscribe({

        next: (res: any) => {

          console.log('getTotalLength next res', res);

          if (res.result) {
            this.length = res.data.length
          }

        },
        error: (res: any) => {
          console.log(' getTotalLength error res', res);



        }


      })
  }


  //OPEN CREATE TABLE
  openCreateTable(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(CreateTableComponent, {
      data: {},
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe(() => {

      this.getTotalLength()

      this.filters.end_date = ''
      this.filters.start_date = ''
      this.filters.pageIndex = 0
      this.filters.pageSize = 10
      this.filters.user = 0
      this.filters.status = ''
      this.getTables(true)

    })
  }

  //OPEN CREATE TABLE
  openEditTable(enterAnimationDuration: string, exitAnimationDuration: string, table: ITable): void {
    this.dialog.open(EditTableComponent, {
      data: {
        table: table
      },
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe(() => {

      this.filters.end_date = ''
      this.filters.start_date = ''
      this.filters.pageIndex = 0
      this.filters.pageSize = 10
      this.filters.user = 0
      this.filters.status = ''
      this.getTables(true)

    })
  }

  deleteTable(table_id: number) {


    Swal.fire({
      title: '¿Desea elimnar la mesa?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        //Delete the user
        this.tablesService.deleteTable(table_id)
          .subscribe({
            next: (res: IResponse) => {
              if (res.result) {
                console.log('deleteTable next res', res);

                fireSuccessDialog('Mesa eliminado con éxito')

                this.filters.end_date = ''
                this.filters.start_date = ''
                this.filters.pageIndex = 0
                this.filters.pageSize = 10
                this.filters.user = 0
                this.filters.status = ''
                this.getTables(true)

              }
            },
            error: (res: any) => {

              if (res.error.error) {

                switch (res.error.message) {
                  case 'Table cant be udpated':
                    fireErrorDialog('La mesa no pudo ser actualziada')
                    break;

                  default:
                    fireErrorDialog('Algo salío mal al tratar de actualziar la mesa')
                    break;
                }



              }
            }
          })

      } else if (result.isDenied) {
      }

    });




  }



  createFilters():ITablesFilters{

    let filters:ITablesFilters = {
      user: 0,
      start_date: '',
      end_date: '',
      status: '',
      pageIndex: 0,
      pageSize: 0
    }

    this.filters.status == '' ? 
      null :
      filters.status =  this.filters.status

    this.filters.user == 0 ? 
      null :
      filters.user =  this.filters.user

    this.filters.start_date == '' ? 
      null :
      filters.start_date =  moment(this.filters.start_date).format('YYYY-MM-DD 00:00:00')

      this.filters.end_date == '' ? 
      null :
      filters.end_date =  moment(this.filters.end_date).format('YYYY-MM-DD 23:59:59')

    this.filters.pageIndex == 0 ? 
      null :
      filters.pageIndex =  this.filters.pageIndex
    
    this.filters.pageSize == 0 ? 
      null :
      filters.pageSize =  this.filters.pageSize


    return filters
  }
}
