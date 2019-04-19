import { Component, OnInit } from '@angular/core';
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

export class ExplorerComponent implements OnInit {
  
  public hasContent: boolean;
  public submitted: boolean;
  public received: boolean;

  public stepTxt: string[];
  public formError: string = '';

  private mailchimpUrl: string = "https://emerson.us6.list-manage.com/subscribe/post-json?u=8cb16e3042072f11cc0680d36&amp;id=58bb1def37&";
  private userForm: any;

  constructor(private _dataSvc: DataService, private _scrollToService: ScrollToService, private _formBuilder: FormBuilder, private _http: HttpClient) {

    this.stepTxt = [
      'Sign up to become a Tech Explorer below. Once you’re on board, start recording your thoughts and e-meet the other Explorers you’ll be working with.',
      'Pay a short visit to your chosen Exploration Zone and answer a couple of questions while you’re there.',
      'Come along to one of our workshops to plan out how you want the explorer to work for your neighborhood, all over a free lunch.',
      'Go and see your experiment come to life. Then, come together with our project’s explorer partners over coffee to share your thoughts.',
      'Come to a second workshop over lunch to reflect on your experiments and think about what we could do next.'
    ];

  }

  ngOnInit() {

    this.userForm = this._formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required]
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