import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup  } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

import { DataService } from '../utils/data.service';

import * as AOS from 'aos';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

interface MailChimpResponse {
  result: string;
  msg: string;
}

@Component({
  selector: 'app-getinvolved',
  templateUrl: './getinvolved.component.html',
  styleUrls: ['./getinvolved.component.scss']
})

export class GetInvolvedComponent implements OnInit, AfterViewInit {
  
  public hasContent: boolean;
  public submitted: boolean;
  public received: boolean;

  public stepTxt: string[][];
  public formError: string = '';

  private mailchimpUrl: string = "https://emerson.us6.list-manage.com/subscribe/post-json?u=8cb16e3042072f11cc0680d36&amp;id=58bb1def37&";
  private userForm: any;

  constructor(private _dataSvc: DataService, private _scrollToService: ScrollToService, private _formBuilder: FormBuilder, private _http: HttpClient) {

    this.stepTxt = [
    
      ['Join The Zone Advisory Group', 'Want to make an impact on the future of one of our Exploration Zones? Zone Advisory Group members play a key role in helping to evaluate real technologies being experimentally deployed in three neighborhoods in Boston.', 'Attend two workshops to evaluate whether new technologies reflect community values and provide feedback to the City of Boston.'],
      ['Become A Youth Tech Explorer', 'Becoming a Tech Explorer gives teens the chance to learn more about technology and imagine how they will transform the city of Boston!', 'Our Tech Explorers learn key civic media skills from data literacy to data justice and help to question and evaluate new technologies deployed in our Experimentation Zones.'],
      ['Attend a Walking Tour', 'Explore a local neighborhood in Boston to discuss the impact and effect of technology on urban environments in the context of that neighborhood’s history.', 'These walking tours are led by local youth and a great way to get involved without needing to make a bigger commitment.']
    ];

  }

  ngOnInit() {

    this.userForm = this._formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'zone': [],
      'explorer': [],
      'tours': [],
      'age': ['', [Validators.required, Validators.requiredTrue]]
    });

    AOS.init({
      duration: 700,
      easing: 'ease-in-out'
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
      .set('LNAME', this.userForm.controls['lastName'].value)
      .set('EMAIL', this.userForm.controls['email'].value)
      .set('b_8cb16e3042072f11cc0680d36_58bb1def37', ''); // hidden input name

    //  if(this.userForm.controls['zone'].value)
    //   params.set();


    const mailChimpUrl = this.mailchimpUrl + params.toString();
    this.received = true;

    // 'c' refers to the jsonp callback param key. This is specific to Mailchimp
    // this._http.jsonp<MailChimpResponse>(mailChimpUrl, 'c').subscribe(response => {
    //   if (response.result) {
    //     this.received = true;
        
    //     if(response.result === 'error')
    //       this.formError = response.msg;
    //   }
    // }, error => {
    //   this.formError = 'Sorry, an error occurred.';
    // });
  }

}