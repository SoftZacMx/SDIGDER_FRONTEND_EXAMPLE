import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { ITable } from 'src/app/admin/interfaces/tables/table.interface';
import { TablesService } from 'src/app/admin/services/tables/tables.service';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.css']
})
export class CreateTableComponent {

  constructor(
    private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<CreateTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userDataService:UserDataService,
    private tableServices:TablesService
    ){
  }

  status_options = [
    {
      description:'Activo',
      value:true
    },
    {
      description:'Inactivo',
      value:false
    }
  ]


  table = this.formBuilder.group({
    number_table: this.formBuilder.control(0,[Validators.required,Validators.min(0),Validators.pattern('[0-9]+')]),
    user_id: this.formBuilder.control(parseInt(this.userDataService.getUserData().id),[Validators.required,Validators.min(1)]),
    creation_date: this.formBuilder.control(moment().format('YYYY-MM-DD hh:mm:ss'),[Validators.required]),
    status: this.formBuilder.control(true,[Validators.required]),

  })

  close(){
    this.dialogRef.close()
  }

  create(){
    let table:ITable = this.table.value as ITable
    this.tableServices.createTable(table)
    .subscribe({
      next:(res:IResponse) => {

        console.log('createTable next res',res);
        
        if (res.result) {
          fireSuccessDialog('Mesa creada con éxito')
          this.close()
        }
      },
      error:(res:any) => {
        
        console.log('createTable error res',res);

        if(res.error.error){

          switch (res.error.message) {
            case 'Table already exist':
              fireErrorDialog('Ya existe una mesa con ese número asignado')
              break;
          
            default:
              fireErrorDialog('Algo salío mal al tratar de crear la mesa')
              break;
          }

        }

      }
    })
  }



}
