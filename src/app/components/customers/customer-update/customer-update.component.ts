import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, map, pluck, switchMap, take } from 'rxjs/operators';

import { AlertService, CustomerService } from '../../../services';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.scss']
})
export class CustomerUpdateComponent implements OnInit, OnDestroy {
  customerForm: FormGroup;
  loading = false;
  submitted = false;
  phoneLengthError = false;
  phoneNumberRequiredLength = 10;
  file: string | ArrayBuffer | null;
  disableUrlUploader = false;
  disableFileUploader = false;
  urlUploaderError = false;
  fileUploaderError = false;
  customerId: string;
  route$: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
  }

  ngOnInit() {
    this.customerId = null;
    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required],
      gender: ['Male', Validators.required],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      photo: ['', [Validators.required]],
      hobbies: [['cricket']]
    });
    this.route$ = this.route.params.pipe(
      filter(param => Boolean(param && param.customerId)),
      pluck('customerId'),
      switchMap((customerId: string) => {
        this.customerId = customerId;
        return this.customerService.getCustomer(customerId);
      })
    ).subscribe((res: Customer) => {
      if (res) {
        this.customerForm.patchValue(res);
        this.file = environment.baseUrl + res.photo;
      }
    })


  }

  ngOnDestroy() {
    if (this.route$) {
      this.route$.unsubscribe();
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.customerForm.controls; }

  validatePhoneLength() {
    const phone = this.f.phone.value;
    if (phone) {
      const phoneNumberLength = phone.toString().split('').length
      if (phoneNumberLength < this.phoneNumberRequiredLength || phoneNumberLength > this.phoneNumberRequiredLength) {
        this.phoneLengthError = true;
      } else {
        this.phoneLengthError = false;
      }
    } else {
      this.phoneLengthError = false;
    }
  }

  updateHobbies(hobby: string) {
    let hobbiesArr = this.f.hobbies.value;
    if (hobbiesArr.length) {
      const matchedHobbyIndex = hobbiesArr.findIndex(h => h === hobby)
      if (matchedHobbyIndex == -1) {
        hobbiesArr.push(hobby);
        this.f.hobbies.setValue(hobbiesArr);
      } else {
        hobbiesArr = hobbiesArr.filter(h => h !== hobby)
        this.f.hobbies.setValue(hobbiesArr);
        this.f.hobbies.updateValueAndValidity();
      }
    } else {
      hobbiesArr.push(hobby);
      this.f.hobbies.setValue(hobbiesArr);
    }

  }

  onFileChange(event: any) {
    // this.fileUploaderError = false;
    this.file = null;
    // if (!event.target.files || (event.target.files && !event.target.files[0])) {
    //   document.getElementById('urlUploader')['disabled'] = false;
    //   this.disableUrlUploader = false;
    //   return;
    // }
    // if (this.disableFileUploader) {
    //   event.preventDefault();
    //   document.getElementById('fileUploader')['value'] = '';
    //   this.fileUploaderError = true;
    //   return;
    // }
    if (event.target.files && event.target.files[0]) {
      // document.getElementById('urlUploader')['disabled'] = true;
      // this.disableUrlUploader = true;
      const photo = event.target.files[0];
      console.log('photo', photo);
      this.f.photo.patchValue(photo);
      
      //  console.log(this.f.photo.value);
      const reader = new FileReader();
      reader.onload = e => {
        this.file = reader.result;
      }
      reader.readAsDataURL(photo);
    }

  }

  onSubmit() {
    this.submitted = true;

    // console.log(this.customerForm.value);
    // stop here if form is invalid
    if (this.customerForm.invalid) {
      return;
    }

    this.loading = true;
    this.customerService.saveCustomer(this.toFormData(this.customerForm.value), this.customerId)
      .pipe(take(1), filter((data: any) => Boolean(data && data.message)))
      .subscribe(
        data => {
          this.alertService.success(data.message, true);
          this.router.navigate(['/customers']);
        },
        error => {
          this.alertService.error(error.error.message);
          this.loading = false;
        });
  }

  toFormData(form: any) {
    let formData: FormData = new FormData();
    
    for (const key in form) {
      if (Object.prototype.hasOwnProperty.call(form, key)) {
        formData.append(key, form[key])
      }
    }
    return formData;
  }
}
