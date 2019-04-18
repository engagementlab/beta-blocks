import { Component, OnInit } from '@angular/core';
// import { FormBuilder, Validators, FormGroup  } from '@angular/forms';
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

  public stepTxt: string[];
  public formError: string;

  private mailchimpUrl: string = "https://emerson.us6.list-manage.com/subscribe/post?u=8cb16e3042072f11cc0680d36&amp;id=58bb1def37";

  constructor(private _dataSvc: DataService, private _scrollToService: ScrollToService) {

    this.stepTxt = [
      'Sign up to become a Tech Explorer below. Once you’re on board, start recording your thoughts and e-meet the other Explorers you’ll be working with.',
      'Pay a short visit to your chosen Exploration Zone and answer a couple of questions while you’re there.',
      'Come along to one of our workshops to plan out how you want the explorer to work for your neighborhood, all over a free lunch.',
      'Go and see your experiment come to life. Then, come together with our project’s explorer partners over coffee to share your thoughts.',
      'Come to a second workshop over lunch to reflect on your experiments and think about what we could do next.'
    ];

  }

  ngOnInit() {

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
  submitForm() {
		this.formError = '';
		// if (this.emailControl.status === 'VALID' && this.nameControl.status === 'VALID') {

		// 	const params = new HttpParams()
		// 		.set('NAME', this.nameControl.value)
		// 		.set('EMAIL', this.emailControl.value)
		// 		.set('b_123abc123abc123abc123abc123abc123abc', ''); // hidden input name

		// 	const mailChimpUrl = this.mailChimpEndpoint + params.toString();

    //   // 'c' refers to the jsonp callback param key. This is specific to Mailchimp
		// 	this.http.jsonp<MailChimpResponse>(mailChimpUrl, 'c').subscribe(response => {
		// 		if (response.result && response.result !== 'error') {
		// 			this.submitted = true;
		// 		}
		// 		else {
		// 			this.formError = response.msg;
		// 		}
		// 	}, error => {
		// 		console.error(error);
		// 		this.formError = 'Sorry, an error occurred.';
		// 	});
		// }
}
}