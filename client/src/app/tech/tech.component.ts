import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DataService } from '../utils/data.service';

import * as AOS from 'aos';

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
      'firstName': ['',],
      'lastName': [''],
      'loc': ['', [Validators.required]],
      'email': ['', [Validators.email]],
      'phone': [''],
      'message': ['', [Validators.required]]
    });

    AOS.init({
      duration: 700,
      easing: 'ease-in-out'
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
    data.type = 'Tech';
    this._dataSvc.sendDataToUrl('/api/contact', data).subscribe((data: any) => {

      this.received = true;

    });

  }

}
