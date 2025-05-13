import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/components/login/login.component';
import { ListsUsersComponent } from './components/users/lists-users/lists-users.component';
import { ListSaourcesComponent } from './components/saources/list-saources/list-saources.component';
import { ListOrdersComponent } from './components/orders/list-orders/list-orders.component';
import { CreateOrderComponent } from './components/orders/create-order/create-order.component';
import { CreateCashRegisterComponent } from './components/cash_register/create-cash-register/create-cash-register.component';
import { ListCashRegistersComponent } from './components/cash_register/list-cash-registers/list-cash-registers.component';
import { OpenCashRegisterComponent } from './components/cash_register/open-cash-register/open-cash-register.component';
import { RolhGuard } from '../guards/rol.guard';
import { BussinesServicesService } from './services/bussines-services/bussines-services.service';
import { ListBussinesServicesComponent } from './components/bussines-services/list-bussines-services/list-bussines-services.component';
import { ListPaymentsServicesComponent } from './components/bussines-services/list-payments-services/list-payments-services.component';
import { CloseCashRegisterComponent } from './components/cash_register/close-cash-register/close-cash-register.component';
import { ListEmployeeSalariesPaymentsComponent } from './components/employees-salaries-payments/list-employee-salaries-payments/list-employee-salaries-payments.component';
import { ListMerchandisePurchaseComponent } from './components/merchandise-purchase/list-merchandise-purchase/list-merchandise-purchase.component';
import { CashFlowComponent } from './components/finances/cash-flow/cash-flow.component';
import { OrdersReportsComponent } from './components/reports/orders/orders-reports/orders-reports.component';
import { ListTablesComponent } from './components/tables/list-tables/list-tables.component';
import { ProductsListComponent } from './components/products/products-list/products-list.component';
import { OrderEditionComponent } from './components/orders/order-edition/order-edition.component';
import { PayOrderComponent } from './components/orders/pay-order/pay-order.component';
import { CategoriesSaourcesListComponent } from './components/categories-saources/categories-saources-list/categories-saources-list.component';
import { DigitalMenuComponent } from '../public/components/digital-menu/digital-menu.component';
import { GenerateQrCodeComponent } from './components/digital-menu/generate-qr-code/generate-qr-code.component';

const routes: Routes = [
  {
    path: 'users',
    component: ListsUsersComponent,
  },
  {
    path: 'orders',
    component: ListOrdersComponent,
  },
  {
    path: 'saources',
    component: ListSaourcesComponent,
  },
  {
    path: 'point-of-sale/create-order',
    canActivate: [RolhGuard],
    component: CreateOrderComponent,
  },
  {
    path: 'point-of-sale/edit-order/:order_id',
    canActivate: [RolhGuard],
    component: OrderEditionComponent,
  },
  {
    path: 'point-of-sale/pay-order/:order_id',
    canActivate: [RolhGuard],
    component: PayOrderComponent,
  },
  {
    path: 'cash-registers',
    component: ListCashRegistersComponent,
  },
  {
    path: 'cash-register-open',
    component: OpenCashRegisterComponent,
  },
  {
    path: 'finances',
    component: CashFlowComponent,
  },
  {
    path: 'bussines-services',
    component: ListBussinesServicesComponent,
  },
  {
    path: 'bussines-services-payments',
    component: ListPaymentsServicesComponent,
  },
  {
    path: 'cash-register-close',
    component: CloseCashRegisterComponent,
  },
  {
    path: 'users-salaries-payments',
    component: ListEmployeeSalariesPaymentsComponent,
  },
  {
    path: 'merchandise-purchase',
    component: ListMerchandisePurchaseComponent,
  },
  {
    path: 'cash-flow-report',
    component: CashFlowComponent,
  },
  {
    path: 'orders-reports',
    component: OrdersReportsComponent,
  },
  {
    path: 'tables',
    component: ListTablesComponent,
  },
  {
    path: 'products',
    component: ProductsListComponent,
  },
  {
    path: 'categories-saources',
    component: CategoriesSaourcesListComponent,
  },
  {
    path: 'digital-menu',
    component: GenerateQrCodeComponent,
  },
  {
    path: 'create-order/:order_id/:edition',
    component: CreateOrderComponent,
  },
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
