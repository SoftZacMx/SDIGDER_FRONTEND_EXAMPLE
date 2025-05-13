import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IUser } from 'src/app/admin/interfaces/users/user.interface';
import { SelectUserComponent } from '../../generic/select-user/select-user.component';
import { MatDialog } from '@angular/material/dialog';
import { SelectCashRegisterComponent } from '../../generic/select-cash-register/select-cash-register.component';
import { ICashRegisterInterface } from 'src/app/admin/interfaces/cashs_register/cash-register.interface';
import * as moment from 'moment';
import { IOpeningCashRegister } from 'src/app/admin/interfaces/cashs_register/opening-cash-register.interface';
import { CashRegisterService } from 'src/app/admin/services/cash_register/cash-register.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import Swal from 'sweetalert2';
import { fireErrorDialog, fireSuccessDialog } from 'src/app/shared/handlers/dialog.handler';
@Component({
  selector: 'app-open-cash-register',
  templateUrl: './open-cash-register.component.html',
  styleUrls: ['./open-cash-register.component.css']
})
export class OpenCashRegisterComponent {

  user: string = ''
  cash_register: string = ''

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private cashRegisterService: CashRegisterService
  ) { }

  opening_cash = this.formBuilder.group({
    user_id: this.formBuilder.control(0, [Validators.required, Validators.min(1)]),
    opening_date: this.formBuilder.control(moment().format('YYYY-MM-DD hh:mm:ss'), [Validators.required]),
    cash_register_id: this.formBuilder.control(0, [Validators.required, Validators.min(0)]),
    status: this.formBuilder.control(true, [Validators.required]),
    cash: this.formBuilder.control(0, [Validators.required, Validators.min(0)]),

  })


  //OPEN SELECT CASH REGISTER
  openDialogSelectCashRegister(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SelectCashRegisterComponent, {
      data: {},
      width: '500px',
      height: '550px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed().subscribe((data: ICashRegisterInterface) => {


      if (data == null) {
        return
      }

      this.opening_cash.controls.cash_register_id.setValue(data.id!)
      this.cash_register = `Caja ${data.id} - ${data.name} ${data.last_name} ${data.second_last_name}`

      this.opening_cash.controls.user_id.setValue(data.user_id!)
      this.user = `${data.name} ${data.last_name} ${data.second_last_name}`



    })
  }

  //CLEAN INPUTS FILTERS
  clean(key: string) {
    switch (key) {
      case 'user':
        this.user = ''
        break;
      case 'cash_register':
        this.cash_register = ''
        break;
      default:
        break;
    }
  }

  //OPEN CASH
  openCashRegister() {
    let opening_cash = this.opening_cash.value as IOpeningCashRegister
    this.cashRegisterService.openCashRegister(opening_cash)
      .subscribe({
        next: (res: IResponse) => {
          console.log('openCashRegister next res', res);
          if (res.result) {
            fireSuccessDialog('Caja aperturada con éxito')
          }

        },
        error: (error: any) => {
          console.log('openCashRegister error res', error);
          if (error.error) {
            switch (error.error.message) {
              case 'Cash register is already open':
                fireErrorDialog('Ya existe una caja aperturda en la fecha actual')
                break;
              case 'Cash register and/or user is not activate':
                fireErrorDialog('El usuario o la caja estan desactivadas')
                break;
                
              default:
                fireErrorDialog('Algo salió mal al tratar de aperturar la caja')

                break;
            }
          }
        }
      })

  }

}
