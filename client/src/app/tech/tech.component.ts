import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DataService } from '../utils/data.service';

@Component({
  selector: 'app-tech',
  templateUrl: './tech.component.html',
  styleUrls: ['./tech.component.scss']
})
export class TechComponent implements OnInit {

  public submitted: boolean;
  public received: boolean;
  public hasContent: boolean;

  public partners: any[];

  public userForm: FormGroup;

  constructor(private _dataSvc: DataService, private _formBuilder: FormBuilder) { 

    _dataSvc.getDataForUrl('/api/tech/get').subscribe((data: any) => {

      this.partners = data.techData;
      this.hasContent = true;

    });

  }

  ngOnInit() {

    this.userForm = this._formBuilder.group({
      'firstName': ['', [Validators.required, Validators.minLength(2)]],
      'lastName': ['', Validators.required],
      'url': ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      'email': ['', [Validators.required, Validators.email]],
      'phone': ['', [Validators.required, this.phoneValidator]],
      'message': ['', [Validators.required, Validators.minLength(10)]]
    });

  }

  // Validates US phone numbers
  private phoneValidator(number): any {

    if (number.pristine) {
      return null;
    }

    const PHONE_REGEXP = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;

    number.markAsTouched();

    if (PHONE_REGEXP.test(number.value)) {
      return null;
    }

    return {
      invalidNumber: true
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.userForm.controls;
  }

  submitForm() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    let data = this.userForm.value;
    data.type = 'Partner';
    this._dataSvc.sendDataToUrl('/api/contact', data).subscribe((data: any) => {

      this.received = true;

    });

  }

}
