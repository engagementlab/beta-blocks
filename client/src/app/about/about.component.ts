import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import * as ismobile from 'ismobilejs';
import { DataService } from '../utils/data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public isPhone: boolean;
  public submitted: boolean;
  public received: boolean;

  private userForm: any;

  constructor(private _dataSvc: DataService, private _formBuilder: FormBuilder) {
    
    this.isPhone = ismobile.phone;
  
  }

  ngOnInit() {
    this.userForm = this._formBuilder.group({
      'name': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'message': ['', [Validators.required, Validators.minLength(10)]]
    });
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
    data.type = 'General';
    this._dataSvc.sendDataToUrl('/api/contact', data).subscribe((data: any) => {

      this.received = true;

    });

  }

}
