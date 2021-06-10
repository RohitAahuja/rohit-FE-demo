import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, filter, map, pluck, switchMap, take } from 'rxjs/operators';

import { AlertService, CustomerService } from '../../../services';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  customer: Customer;
  customerId: string;
  file: string;
  route$: Subscription;
  loading = false;
  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.customerId = null;
    this.loading = true;
    this.route$ = this.route.params.pipe(
      filter(param => {
        console.log(param);
        return Boolean(param && param.customerId)
      }),
      pluck('customerId'),
      switchMap((customerId: string) => {
        this.customerId = customerId;
        return this.customerService.getCustomer(customerId);
      }), catchError((err) => {
        this.loading = false;
        throw err;
      })
    ).subscribe((res: Customer) => {
      this.loading = false;
      if (res) {
        this.customer = res;
        this.file = environment.baseUrl + res.photo
      }
    })


  }

  ngOnDestroy() {
    if (this.route$) {
      this.route$.unsubscribe();
    }
  }

}
