import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup  } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

import { DataService } from '../utils/data.service';

import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

interface MailChimpResponse {
  result: string;
  msg: string;
}

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})

export class ExplorerComponent implements OnInit, AfterViewInit {
  
  public hasContent: boolean;
  public submitted: boolean;
  public received: boolean;

  public stepTxt: string[];
  public formError: string = '';

  private mailchimpUrl: string = "https://emerson.us6.list-manage.com/subscribe/post-json?u=8cb16e3042072f11cc0680d36&amp;id=58bb1def37&";
  private userForm: any;

  constructor(private _dataSvc: DataService, private _scrollToService: ScrollToService, private _formBuilder: FormBuilder, private _http: HttpClient) {

    this.stepTxt = [
      'Sign up below to join our pool of potential Tech Explorers. You’ll get a follow up email inviting you to choose a neighborhood from the 3 available zones (currently including Lower Allston, Chinatown, or Codman Square).',
      'Sign up for a workshop series in your chosen neighborhood. Please note that spaces may be limited and in case of high volume, slots will be assigned a first-come, first served basis.',
      'Attend an initial workshop in the neighborhood to meet your fellow explorers, and learn about the featured technology. Propose an idea for using the tech in your neighborhood, and enjoy some refreshments.',
      'Go and see your proposal brought to life in a trial deployment of the technology. Then, come together with our project’s explorer partners over coffee to share your thoughts.',
      'Come to a second workshop with refreshments to reflect on the technology, evaluate its impact, and propose a way forward.'
    ];

  }

  ngOnInit() {

    this.userForm = this._formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'age': ['', [Validators.required, Validators.requiredTrue]]
    });

  }
  
  ngAfterViewInit() {

    if (window.location.hash === '#signup')
      this.goToForm();

  }

  goToForm() {

    window.location.hash = '#signup';
    this._scrollToService
      .scrollTo({
        target: document.getElementById('form'),
        offset: 100,
        easing: 'easeOutQuint',
        duration: 700
      });

  }
  
  // convenience getter for easy access to form fields
  get f() {
    return this.userForm.controls;
  }

  submitForm() {

    this.formError = '';
    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    const params = new HttpParams()
      .set('FNAME', this.userForm.controls['firstName'].value)
      .set('LNAME',this.userForm.controls['lastName'].value)
      .set('EMAIL', this.userForm.controls['email'].value)
      .set('b_8cb16e3042072f11cc0680d36_58bb1def37', ''); // hidden input name

    const mailChimpUrl = this.mailchimpUrl + params.toString();

    console.log(this.userForm.controls)
    // 'c' refers to the jsonp callback param key. This is specific to Mailchimp
    this._http.jsonp<MailChimpResponse>(mailChimpUrl, 'c').subscribe(response => {
      if (response.result) {
        this.received = true;
        
        if(response.result === 'error')
          this.formError = response.msg;
      }
    }, error => {
      this.formError = 'Sorry, an error occurred.';
    });
  }

}