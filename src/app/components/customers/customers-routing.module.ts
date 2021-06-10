import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerUpdateComponent } from './customer-update/customer-update.component';

import { CustomersComponent } from './customers.component';

const routes: Routes = [
  { path: '', component: CustomersComponent },
  { path: 'add', component: CustomerUpdateComponent },
  { path: ':customerId/view', component: CustomerDetailComponent },
  { path: ':customerId', component: CustomerUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
