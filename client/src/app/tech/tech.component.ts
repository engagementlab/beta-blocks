import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup  } from '@angular/forms';

import { DataService } from '../utils/data.service';

import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-tech',
  templateUrl: './tech.component.html',
  styleUrls: ['./tech.component.scss']
})
export class TechComponent implements OnInit {
  
  public submitted: boolean;
  public received: boolean;
  public hasContent: boolean;

  public userForm: FormGroup;

  public stepTxt: string[];
  public partners: any[];

  constructor(private _dataSvc: DataService, private _formBuilder: FormBuilder, private _scrollToService: ScrollToService) {

    this.stepTxt = [
      'Sign up to become a Tech Explorer below. Once you’re on board, start recording your thoughts and e-meet the other Explorers you’ll be working with.',
      'Pay a short visit to your chosen Exploration Zone and answer a couple of questions while you’re there.',
      'Come along to one of our workshops to plan out how you want the tech to work for your neighborhood, all over a free lunch.',
      'Go and see your experiment come to life. Then, come together with our project’s tech partners over coffee to share your thoughts.',
      'Come to a second workshop over lunch to reflect on your experiments and think about what we could do next.'
    ];

    _dataSvc.getDataForUrl('/api/tech/get').subscribe((data: any) => {

      this.partners = data.techData;
      this.hasContent = true;

    });

  }

  ngOnInit() {

    this.userForm = this._formBuilder.group({
      'firstName': ['', [Validators.required, Validators.minLength(2)]],
      'lastName': ['', Validators.required],
      'org': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'phone': ['', [Validators.required, this.phoneValidator]]
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
    data.type = 'Explorer';
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
