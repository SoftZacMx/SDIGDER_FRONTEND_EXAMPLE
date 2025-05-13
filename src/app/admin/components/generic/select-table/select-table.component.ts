import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/admin/services/users/users.service';
import { SelectUserComponent } from '../select-user/select-user.component';
import { MatSelectionList } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { ITable } from 'src/app/admin/interfaces/tables/table.interface';
import { ITablesFilters } from 'src/app/admin/interfaces/tables/tables.filters.interface';
import { TablesService } from 'src/app/admin/services/tables/tables.service';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['./select-table.component.css']
})
export class SelectTableComponent implements OnInit {

  table_selected: any = undefined
  user: string = ''

  constructor(
    public dialogRef: MatDialogRef<SelectTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userServices: UsersService,
    private tablesService: TablesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    console.log(' this.data.availability_status', this.data.availability_status);
    
    this.data.availability_status ?
      this.filters.availability_status = this.data.availability_status :
      null



    this.getTotalLength();
    this.getTables()
  }

  saveUserSelected(list: MatSelectionList) {
    this.table_selected = list._value![0]
    this.close()
  }

  close() {
    this.dialogRef.close(this.table_selected)
  }

  tables: ITable[] = []

  filters: ITablesFilters = {
    user: 0,
    availability_status: true,
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


  //PAGINATOR
  pageSizeOptions = [2, 5, 10, 25,50,100];
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

    this.getTables()
  }

  search() {
    this.getTotalLength()
    this.getTables()
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


  getTables() {
    let filters = this.createFilters()
    
    this.tablesService.getTables(filters)
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

          this.length = 0


        }


      })
  }

  createFilters(): ITablesFilters {

    let filters: ITablesFilters = {
      user: 0,
      start_date: '',
      end_date: '',
      availability_status: false,
      status: '',
      pageIndex: 0,
      pageSize: 0
    }

    this.filters.status == '' ?
      null :
      filters.status = this.filters.status


    filters.availability_status = this.filters.availability_status


    this.filters.user == 0 ?
      null :
      filters.user = this.filters.user

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

}
