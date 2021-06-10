import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Customer, IPagebleData } from 'src/app/models/customer';
import { AuthenticateService, CustomerService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ModalComponent;
  view: string = 'list';
  selectedCustomerId: string;
  res: IPagebleData<Customer> = null;
  currentUser = this.authenticateService.currentUserValue;
  allCustomersSub: Subscription;
  deleteItemSub: Subscription;
  loading = false;
  currentPage = '1';
  totalPages: number;
  totalPagesArr: number[];
  direction = null;
  constructor(private customerService: CustomerService, private authenticateService: AuthenticateService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(qp => {
      this.getAllCustomers(qp.page);
    })
  }

  ngOnDestroy() {
    this.allCustomersSub && this.allCustomersSub.unsubscribe();
    this.deleteItemSub && this.deleteItemSub.unsubscribe();
  }

  toggleSortDirection(direction: string) {
    this.direction = direction === 'asc' ? 'desc' : 'asc';
    this.sortCustomers(this.direction);
  }

  sortCustomers(direction: string) {
    const customers = this.res && this.res.customers && this.res.customers.length && this.res.customers.sort((a, b) => {
      if (direction === 'asc') {
        return a.name > b.name ? 1 : -1; 
      }
      return a.name > b.name ? -1 : 1;
    });
    this.res = {...this.res, customers};
  }

  totalPagesListArray(pages: number): number[] {
    const arr: number[] = [];
    for (let i = 0; i < pages; i++) {
      arr.push(i);
    }
    return arr;
  }

  getAllCustomers(page: string) {
    this.loading = true;
    this.allCustomersSub = this.customerService.getAllCustomers(page).subscribe((res: IPagebleData<Customer>) => {
      this.res = res;
      this.loading = false;
      if (res && res.customers && res.customers.length) {
        const customers = res.customers.map((c: Customer) => ({ ...c, photo: environment.baseUrl + c.photo }));
        this.res = { ...this.res, customers };
        this.totalPagesArr = this.totalPagesListArray(res.totalPages);
        this.totalPages = res.totalPages;
      }
      if (this.direction) {
        this.sortCustomers(this.direction);
      }
    }, () => {
      this.loading = false;
    })
  }

  openConformationPopup(customerId: string): void {
    this.selectedCustomerId = customerId;
    this.modal.open();
  }

  onDelete() {
    this.deleteItemSub = this.customerService.deleteCustomer(this.selectedCustomerId).subscribe(() => this.getAllCustomers(this.currentPage));
  }

}
