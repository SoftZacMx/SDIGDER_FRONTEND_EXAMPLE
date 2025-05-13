import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ISaource } from 'src/app/admin/interfaces/saources/saource.interface';
import { ISaourcesFilters } from 'src/app/admin/interfaces/saources/saources.filters.inerface';
import { SaourcesService } from 'src/app/admin/services/saources/saources.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import Swal from 'sweetalert2';
import { CreateSaourceComponent } from '../../saources/create-saource/create-saource.component';
import { EditSaourceComponent } from '../../saources/edit-saource/edit-saource.component';
import { SelectUserComponent } from '../select-user/select-user.component';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-select-saource',
  templateUrl: './select-saource.component.html',
  styleUrls: ['./select-saource.component.css']
})
export class SelectSaourceComponent {
  constructor(
    public dialogRef: MatDialogRef<SelectSaourceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private saourceService: SaourcesService
  ) { }

  ngOnInit(): void {
    this.getSaources()
    this.getTotalLenght()
  }

  filters: ISaourcesFilters = {
    status: '',
    name: '',
    pageIndex: 0,
    pageSize: 0,
    category: 0
  }

  saource_name: string = ''

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

  saources: ISaource[] = []

  saourcesSelected = []

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

    this.getSaources()
  }



  //GET SAOURCES
  getSaources() {
    let filters = this.createFilters()

    this.saourceService.getSaources(filters)
      .subscribe({

        next: (res: IResponse) => {

          console.log('getSaources next res', res);

          if (res.result) {
            this.saources = res.data
          }

        },
        error: (res: any) => {
          console.log('getSaources error res', res);



        }


      })
  }

  getTotalLenght() {
    let filters = this.createFilters()
    filters.pageSize = 0
    this.saourceService.getSaources(filters)
      .subscribe({

        next: (res: IResponse) => {

          console.log('getSaources next res', res);

          if (res.result) {
            this.length = res.data.length 
          }

        },
        error: (res: any) => {
          console.log('getSaources error res', res);



        }


      })
  }


  //SEARCH
  search() {
    this.getTotalLenght()
    this.getSaources()
  }


  //DELETE SAOURCE
  deleteSaource(saource_id: number) {

    Swal.fire({
      title: "¿Desea eliminar el platillos?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.saourceService.deleteSaource(saource_id)
          .subscribe({

            next: (res: IResponse) => {

              console.log('deleteSaource next res', res);

              if (res.result) {
                fireSuccessDialog('Platillo eliminado con éxito')

                this.filters.status = ''
                this.filters.pageIndex = 0
                this.filters.pageSize = 0

                this.getTotalLenght()
                this.getSaources()


              }

            },
            error: (res: any) => {

              console.log('deleteSaource error res', res);

              fireErrorDialog('Error al tratar de eliminar el platillo')


            }
          })
      } else if (result.isDenied) {
      }
    });


  }

  createFilters(): ISaourcesFilters {

    let filters: ISaourcesFilters = {
      status: '',
      name: '',
      pageIndex: 0,
      pageSize: 0,
      category: 0

    }

    this.filters.status == '' ?
      null :
      filters.status = this.filters.status

    this.filters.pageIndex == 0 ?
      null :
      filters.pageIndex = this.filters.pageIndex

    this.filters.pageSize == 0 ?
      null :
      filters.pageSize = this.filters.pageSize

    this.filters.name == '' ?
      null :
      filters.name = this.filters.name

      this.filters.category = filters.category


    return filters
  }

  saveSelections(selectionList: MatSelectionList) {


    this.dialogRef.close(selectionList._value)


  }


  test(selectionList: MatSelectionList) {

    let newSaources = selectionList._value

    if (this.saourcesSelected.length == 0) {
      this.saourcesSelected = selectionList._value
    } else {

      newSaources.map((newSaource: any) => {

        let exist = this.saourcesSelected.find((oldSaource: any) => {
          newSaource.id == oldSaource.id
        })

        if (exist == undefined) {
          this.saourcesSelected.push(newSaource)
        }


      })




    }

  }
}
