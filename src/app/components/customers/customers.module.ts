import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { ModalComponent } from './modal/modal.component';
import { IsLoadingDirective } from 'src/app/directives';
import { LoaderComponent } from '../loader';
import { CustomerDetailComponent } from './customer-detail';
import { CustomerUpdateComponent } from './customer-update';


@NgModule({
  declarations: [CustomersComponent, CustomerDetailComponent, CustomerUpdateComponent, ModalComponent, LoaderComponent, IsLoadingDirective],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    ReactiveFormsModule
  ]
})
export class CustomersModule { }
