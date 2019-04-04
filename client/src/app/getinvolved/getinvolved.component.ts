import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators,  } from '@angular/forms';

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
  public hasContent;
  public events: any[];

  private userForm: any;

  @ViewChild('map') mapBox: MapBoxComponent;

  constructor(private _dataSvc: DataService, private _formBuilder: FormBuilder, private _scrollToService: ScrollToService) {

    this.isPhone = ismobile.phone;

    _dataSvc.getDataForUrl('/api/events/get').subscribe((data: any) => {

      this.events = data;
      this.hasContent = true;

    });

    this.userForm = _formBuilder.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'url': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'phone': ['', [Validators.required, this.phoneValidator ]],
      'message': ['', [Validators.required, Validators.minLength(30)]]
    });

  }

  ngOnInit() {
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
