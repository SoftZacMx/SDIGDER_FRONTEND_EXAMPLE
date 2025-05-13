import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { UsersService } from 'src/app/admin/services/users/users.service';
import { fireSuccessDialog, fireErrorDialog } from 'src/app/shared/handlers/dialog.handler';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { CreateUserComponent } from '../../users/create-user/create-user.component';
import { SelectUserComponent } from '../../generic/select-user/select-user.component';
import * as moment from 'moment';
import { ICashRegisterInterface } from 'src/app/admin/interfaces/cashs_register/cash-register.interface';
import { CashRegisterService } from 'src/app/admin/services/cash_register/cash-register.service';

@Component({
  selector: 'app-create-cash-register',
  templateUrl: './create-cash-register.component.html',
  styleUrls: ['./create-cash-register.component.css']
})
export class CreateCashRegisterComponent {


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
    public dialogRef: MatDialogRef<CreateCashRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cashRegisterService:CashRegisterService,
    private dialog:MatDialog
    ){}


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
    status: this.formBuilder.control(true,[Validators.required])
  })


  close(){

    this.dialogRef.close()

  }

  create(){

    
    let cash_register:ICashRegisterInterface = this.cash_register.value as ICashRegisterInterface
    this.cashRegisterService.createCashRegister(cash_register)
      .subscribe({

        next:(res:IResponse) => {

          console.log('createCashRegister next res',res);
          
          if (res.result) {
            fireSuccessDialog('Caja registrada con éxito')
            this.close()
          }
        },

        error:(res:any) => {
          
          console.log('createCashRegister error res',res);

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

}
