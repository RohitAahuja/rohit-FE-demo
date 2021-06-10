import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, take } from 'rxjs/operators';

import { AlertService, AuthenticateService } from '../../services';
@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    phoneLengthError = false;
    phoneNumberRequiredLength = 10;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticateService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            userName: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(5)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(5)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

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

    onSubmit() {
        this.submitted = true;

        for (const control in this.f) {
            if (this.f[control].value && control !== 'phone') {
                this.f[control].setValue(this.f[control].value.trim());
            }
        }
        this.registerForm.updateValueAndValidity();

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.register(this.registerForm.value)
            .pipe(take(1), filter((data: any) => Boolean(data && data.message)))
            .subscribe(
                data => {
                    this.alertService.success(data.message, true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error.error.message);
                    this.loading = false;
                });
    }
}
