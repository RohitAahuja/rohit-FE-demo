import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Customer, IPagebleData } from '../models/customer';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CustomerService {
    customerUrl = environment.baseUrl + 'customer';
    constructor(private http: HttpClient) { }

    getAllCustomers(page: string): Observable<IPagebleData<Customer>> {
        return this.http.get<IPagebleData<Customer>>(this.customerUrl + '?page=' + (page || '1'));
    }

    getCustomer(customerId: string) {
        return this.http.get<Customer>(`${this.customerUrl}/${customerId}`);
    }

    saveCustomer(customerData: FormData, customerId?: string) {
        if (customerId) {
            return this.http.put<Customer>(`${this.customerUrl}/${customerId}`, customerData);
        }
        return this.http.post<Customer>(this.customerUrl, customerData);
    }

    deleteCustomer(customerId: string) {
        return this.http.delete(`${this.customerUrl}/${customerId}`);
    }
}