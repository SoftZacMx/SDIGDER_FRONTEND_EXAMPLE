import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ITable } from 'src/app/admin/interfaces/tables/table.interface';
import { TablesService } from 'src/app/admin/services/tables/tables.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';
import { CreateTableComponent } from '../create-table/create-table.component';

@Component({
  selector: 'app-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.css']
})
export class EditTableComponent  implements OnInit{
  constructor(
    private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<CreateTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userDataService:UserDataService,
    private tableServices:TablesService
    ){
  }

  ngOnInit(): void {
    this.setValues()
  }

  status_options = [
    {
      description:'Activo',
      value:1
    },
    {
      description:'Inactivo',
      value:0
    }
  ]


  table = this.formBuilder.group({
    id: this.formBuilder.control(0,[Validators.required,Validators.min(1)]),
    number_table: this.formBuilder.control(0,[Validators.required,Validators.min(0),Validators.pattern('[0-9]+')]),
    status: this.formBuilder.control(true,[Validators.required]),

  })

  close(){
    this.dialogRef.close()
  }

  edit(){
    let table:ITable = this.table.value as ITable
    this.tableServices.editTable(table)
    .subscribe({
      next:(res:IResponse) => {

        console.log('editTable next res',res);
        
        if (res.result) {
          fireSuccessDialog('Mesa editada con éxito')
          this.close()
        }
      },
      error:(res:any) => {
        
        console.log('editTable error res',res);

        if(res.error.error){

          switch (res.error.message) {
            case 'Table already exist':
              fireErrorDialog('Ya existe una mesa con ese número asignado')
              break;
          
            default:
              fireErrorDialog('Algo salío mal al tratar de editar la mesa')
              break;
          }

        }

      }
    })
  }


  setValues(){
    this.table.controls.number_table.setValue(this.data.table.number_table)
    this.table.controls.status.setValue(this.data.table.status)
    this.table.controls.id.setValue(this.data.table.id)
  }
}
