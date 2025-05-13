import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IProducts } from 'src/app/admin/interfaces/products/product.interface';
import { IPurchaseMerchandiseInterface } from 'src/app/admin/interfaces/purchase_merchandise/purchase_merchandise.interface';
import { PurchaseMerchandiseService } from 'src/app/admin/services/purchase-merchandise/purchase-merchandise.service';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';

@Component({
  selector: 'app-purchase-merchandise-detail',
  templateUrl: './purchase-merchandise-detail.component.html',
  styleUrls: ['./purchase-merchandise-detail.component.css']
})
export class PurchaseMerchandiseDetailComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<PurchaseMerchandiseDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private purcheMerchandiseService: PurchaseMerchandiseService,
  ) { }

  merchandisePurchase:IPurchaseMerchandiseInterface
  merchandisePurchaseProducst : IProducts[] = []
  ngOnInit(): void {
    this.merchandisePurchase =  this.data.purchase_merchandise
    this.getMerchandisePurchaseProducts()
  }

  getMerchandisePurchaseProducts(){
    this.purcheMerchandiseService.getMerchandisePurchaseProducts(this.merchandisePurchase.id)
      .subscribe({
        next:(res:IResponse) => {
          if (res.result) {
            console.log('getMerchandisePurchaseProducts res',res);
            this.merchandisePurchaseProducst = res.data
          } 
        },
        error:(error:any) => {
          console.log('getMerchandisePurchaseProducts error',error);
          if (error.error.error) {
            switch (error.error.message) {
              case '':
                
                break;
            
              default:
                break;
            }
          }

        }
      })
  }

  close(){
    this.dialogRef.close()
  }

  


}
