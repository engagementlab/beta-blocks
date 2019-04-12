import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup  } from '@angular/forms';

import { DataService } from '../utils/data.service';
import { MapBoxComponent } from '../map-box/map-box.component';

import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import * as ismobile from 'ismobilejs';

@Component({
  selector: 'app-getinvolved',
  templateUrl: './getinvolved.component.html',
  styleUrls: ['./getinvolved.component.scss']
})

export class GetinvolvedComponent implements OnInit {

  public isPhone: boolean;
  public submitted: boolean;
  public received: boolean;

  public hasContent;
  public events: any[];

  public userForm: FormGroup;

  @ViewChild('map') mapBox: MapBoxComponent;

  constructor(private _dataSvc: DataService, private _formBuilder: FormBuilder, private _scrollToService: ScrollToService) {

    this.isPhone = ismobile.phone;

    _dataSvc.getDataForUrl('/api/events/get/eventbrite').subscribe((data: any) => {

      this.events = data.eventbrite;
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

  // convenience getter for easy access to form fields
  get f() {
    return this.userForm.controls;
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

  public clickEvent(e: any) {

    this.mapBox.move(e.lat, e.lng, e.id);

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

  goToForm() {

    this._scrollToService
      .scrollTo({
        target: document.getElementById('form'),
        offset: 200,
        easing: 'easeOutQuint',
        duration: 700
      });

  }

}
