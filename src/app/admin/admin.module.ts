import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from '../auth/components/login/login.component';
import { VerifyUserComponent } from '../auth/components/verify-user/verify-user.component';
import { ResetPasswordComponent } from '../auth/components/reset-password/reset-password.component';
import { MaterialModule } from '../material/material.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CreateUserComponent } from './components/users/create-user/create-user.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';
import { ListsUsersComponent } from './components/users/lists-users/lists-users.component';

import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { UsersPipe } from './pipes/users/users.pipe';
import { ListOrdersComponent } from './components/orders/list-orders/list-orders.component';
import { CreateOrderComponent } from './components/orders/create-order/create-order.component';
import { CreateSaourceComponent } from './components/saources/create-saource/create-saource.component';
import { EditSaourceComponent } from './components/saources/edit-saource/edit-saource.component';
import { ListSaourcesComponent } from './components/saources/list-saources/list-saources.component';
import { SelectUserComponent } from './components/generic/select-user/select-user.component';
import { SelectCashRegisterComponent } from './components/generic/select-cash-register/select-cash-register.component';
import { CashRegisterUserPipe } from './pipes/cash_registers/cash-register-user.pipe';
import { SelectSaourceComponent } from './components/generic/select-saource/select-saource.component';
import { OrderDetailComponent } from './components/orders/order-detail/order-detail.component';
import { ListCashRegistersComponent } from './components/cash_register/list-cash-registers/list-cash-registers.component';
import { EditCashRegistersComponent } from './components/cash_register/edit-cash-registers/edit-cash-registers.component';
import { CreateCashRegisterComponent } from './components/cash_register/create-cash-register/create-cash-register.component';
import { OpenCashRegisterComponent } from './components/cash_register/open-cash-register/open-cash-register.component';
import { CashFlowComponent } from './components/finances/cash-flow/cash-flow.component';
import { ListBussinesServicesComponent } from './components/bussines-services/list-bussines-services/list-bussines-services.component';
import { CreateBussinesServiceComponent } from './components/bussines-services/create-bussines-service/create-bussines-service.component';
import { EditBussinesServiceComponent } from './components/bussines-services/edit-bussines-service/edit-bussines-service.component';
import { PayServiceComponent } from './components/bussines-services/pay-service/pay-service.component';
import { BussinesServicesPipe } from './pipes/bussines-services/bussines-services.pipe';
import { ListPaymentsServicesComponent } from './components/bussines-services/list-payments-services/list-payments-services.component';
import { SelectServiceComponent } from './components/generic/select-service/select-service.component';
import { CloseCashRegisterComponent } from './components/cash_register/close-cash-register/close-cash-register.component';
import { SelectOpeningCashRegisterComponent } from './components/generic/select-opening-cash-register/select-opening-cash-register.component';
import { ListEmployeeSalariesPaymentsComponent } from './components/employees-salaries-payments/list-employee-salaries-payments/list-employee-salaries-payments.component';
import { EditEmployeeSalariePaymentComponent } from './components/employees-salaries-payments/edit-employee-salarie-payment/edit-employee-salarie-payment.component';
import { ListMerchandisePurchaseComponent } from './components/merchandise-purchase/list-merchandise-purchase/list-merchandise-purchase.component';
import { CreateMerchandisePurchaseComponent } from './components/merchandise-purchase/create-merchandise-purchase/create-merchandise-purchase.component';
import { EditMerchandisePurchaseComponent } from './components/merchandise-purchase/edit-merchandise-purchase/edit-merchandise-purchase.component';
import { CreateEmployeeSalariePaymentComponent } from './components/employees-salaries-payments/create-employee-salarie-payment/create-employee-salarie-payment.component';
import { CreateSaleTicketComponent } from './components/sale-ticket/create-sale-ticket/create-sale-ticket.component';
import { MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';
import { OrdersReportsComponent } from './components/reports/orders/orders-reports/orders-reports.component';
import { CreateTableComponent } from './components/tables/create-table/create-table.component';
import { EditTableComponent } from './components/tables/edit-table/edit-table.component';
import { ListTablesComponent } from './components/tables/list-tables/list-tables.component';
import { SelectTableComponent } from './components/generic/select-table/select-table.component';
import { ProductsListComponent } from './components/products/products-list/products-list.component';
import { ProductCreationComponent } from './components/products/product-creation/product-creation.component';
import { ProductsPipe } from './pipes/products/products.pipe';
import { EditProductComponent } from './components/products/edit-product/edit-product.component';
import { SelectProductsComponent } from './components/generic/select-products/select-products.component';
import { PurchaseMerchandiseDetailComponent } from './components/merchandise-purchase/purchase-merchandise-detail/purchase-merchandise-detail.component';
import { OrderEditionComponent } from './components/orders/order-edition/order-edition.component';
import { PayOrderComponent } from './components/orders/pay-order/pay-order.component';
import { PrintKitchenTicketComponent } from './components/orders/print-kitchen-ticket/print-kitchen-ticket.component';
import { SharedModule } from '../shared/shared.module';
import { CategoriesSaourcesListComponent } from './components/categories-saources/categories-saources-list/categories-saources-list.component';
import { CategoriesSaourcesCreationComponent } from './components/categories-saources/categories-saources-creation/categories-saources-creation.component';
import { CategoriesSaourcesEditionComponent } from './components/categories-saources/categories-saources-edition/categories-saources-edition.component';
import { CategoriesSaourcesPipe } from './pipes/categories-saources/categories-saources.pipe';
import { SelectSaourceCategoryComponent } from './components/generic/select-saource-category/select-saource-category.component';
import { GenerateQrCodeComponent } from './components/digital-menu/generate-qr-code/generate-qr-code.component';
import { QRCodeModule } from 'angularx-qrcode';
import { LucideAngularModule, File, Home, Menu, UserCheck,Orbit } from 'lucide-angular';


@NgModule({
  declarations: [

  
    SidenavComponent,
        CreateUserComponent,
        EditUserComponent,
        ListsUsersComponent,
        UsersPipe,
        ListOrdersComponent,
        CreateOrderComponent,
        CreateSaourceComponent,
        EditSaourceComponent,
        ListSaourcesComponent,
        SelectUserComponent,
        SelectCashRegisterComponent,
        CashRegisterUserPipe,
        SelectSaourceComponent,
        OrderDetailComponent,
        ListCashRegistersComponent,
        EditCashRegistersComponent,
        CreateCashRegisterComponent,
        OpenCashRegisterComponent,
        CashFlowComponent,
        ListBussinesServicesComponent,
        CreateBussinesServiceComponent,
        EditBussinesServiceComponent,
        PayServiceComponent,
        BussinesServicesPipe,
        ListPaymentsServicesComponent,
        SelectServiceComponent,
        CloseCashRegisterComponent,
        SelectOpeningCashRegisterComponent,
        ListEmployeeSalariesPaymentsComponent,
        EditEmployeeSalariePaymentComponent,
        ListMerchandisePurchaseComponent,
        CreateMerchandisePurchaseComponent,
        EditMerchandisePurchaseComponent,
        CreateEmployeeSalariePaymentComponent,
        CreateSaleTicketComponent,
        OrdersReportsComponent,
        CreateTableComponent,
        EditTableComponent,
        ListTablesComponent,
        SelectTableComponent,
        ProductsListComponent,
        ProductCreationComponent,
        ProductsPipe,
        EditProductComponent,
        SelectProductsComponent,
        PurchaseMerchandiseDetailComponent,
        OrderEditionComponent,
        PayOrderComponent,
        PrintKitchenTicketComponent,
        CategoriesSaourcesListComponent,
        CategoriesSaourcesCreationComponent,
        CategoriesSaourcesEditionComponent,
        CategoriesSaourcesPipe,
        SelectSaourceCategoryComponent,
        GenerateQrCodeComponent,
        
        
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    QRCodeModule,
    LucideAngularModule.pick({File, Home, Menu, UserCheck,Orbit})    
  ]
 
})
export class AdminModule { }
