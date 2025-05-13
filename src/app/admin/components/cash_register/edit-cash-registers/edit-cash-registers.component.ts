import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ICashRegisterInterface } from 'src/app/admin/interfaces/cashs_register/cash-register.interface';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { CashRegisterService } from 'src/app/admin/services/cash_register/cash-register.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { SelectUserComponent } from '../../generic/select-user/select-user.component';

@Component({
  selector: 'app-edit-cash-registers',
  templateUrl: './edit-cash-registers.component.html',
  styleUrls: ['./edit-cash-registers.component.css']
})
export class EditCashRegistersComponent implements OnInit {

  user:string = ''

  //CLASS VARIABLES
  roles = [
    {
      description:'Administrador',
      value:'Administrador'
    },
    {
      description:'Waiter',
      value:'Waiter'
    }
  ]

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


  constructor(
    private formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<EditCashRegistersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cashRegisterService:CashRegisterService,
    private dialog:MatDialog
    ){}


  ngOnInit(): void {
    this.setValues()
  }


    /*
    name:string,
    last_name:string,
    second_last_name:string,
    email: string,
    password: string,
    phone:number,
    status:boolean,
    rol:string
  */
  cash_register = this.formBuilder.group({
    assignment_date: this.formBuilder.control(moment().format('YYYY-MM-DD hh:mm:ss'),[Validators.required]),
    user_id: this.formBuilder.control(0,[Validators.required,Validators.min(1)]),
    status: this.formBuilder.control(true,[Validators.required]),
    id:this.formBuilder.control(this.data.cash_register.id,[Validators.required,Validators.min(1)])
  })


  close(){

    this.dialogRef.close()

  }

  update(){

    
    let cash_register:ICashRegisterInterface = this.cash_register.value as ICashRegisterInterface
    
    this.cashRegisterService.updateCashRegister(cash_register)
      .subscribe({

        next:(res:IResponse) => {

          console.log('updateCashRegister next res',res);
          
          if (res.result) {
            fireSuccessDialog('Caja actualizada con éxito')
            this.close()
          }
        },

        error:(res:any) => {
          
          console.log('updateCashRegister error res',res);

          if(res.error.error){

            switch (res.error.message) {
              case 'User already exist':
                fireErrorDialog('Ya existe un usuario con ese correo')
                break;
            
              default:
                fireErrorDialog('Algo salío mal al tratar de registrar el usuario')
                break;
            }

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
        }).afterClosed().subscribe((data:IUser) => {
            
          if (data == null) {
            return
          }
  
          this.cash_register.controls.user_id.setValue(data.id!)
          this.user = `${data.name} ${data.last_name} ${data.second_last_name}`
  
  
        })
      }

    //CLEAN INPUTS FILTERS
    clean(key:string){
      switch (key) {
        case 'user':
          this.user = ''
          break;
        default:
          break;
      }
    }

    setValues(){
      this.cash_register.controls.assignment_date.setValue( this.data.cash_register.assignment_date) 
      this.cash_register.controls.user_id.setValue( this.data.cash_register.user_id) 
      this.data.cash_register.status == true ? this.cash_register.controls.status.setValue(true) : this.cash_register.controls.status.setValue(false)
      this.user = `${this.data.cash_register.name} ${this.data.cash_register.last_name} ${this.data.cash_register.second_last_name}`
    }

}
