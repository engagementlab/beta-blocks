import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { DataService } from '../utils/data.service';

import * as AOS from 'aos';
import * as ismobile from 'ismobilejs';
import * as _ from 'underscore';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public isPhone: boolean;
  public submitted: boolean;
  public received: boolean;

  public people: any[];
  public hasContent: boolean;

  public selectedName: string;
  public selectedTitle: string;
  public selectedBio: string;

  private userForm: any;

  constructor(private _dataSvc: DataService, private _formBuilder: FormBuilder, private _scrollToService: ScrollToService) {
    
    this.isPhone = ismobile.phone;

    _dataSvc.getDataForUrl('/api/people/get').subscribe((data: any) => {

      this.people = data.peopleData;
      this.hasContent = true;
      
      this.getPerson(0);

    });
    
  }
  
  ngOnInit() {
    
    this.userForm = this._formBuilder.group({
      'name': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'message': ['', [Validators.required, Validators.minLength(10)]]
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
    data.type = 'General';
    this._dataSvc.sendDataToUrl('/api/contact', data).subscribe((data: any) => {

      this.received = true;

    });

  }

  getPerson(i:number) {

    let name = document.querySelector('#people .name');
    let text = document.querySelector('#people .text');
    
    if (name) {
      name.classList.add('change');
      text.classList.add('change');
    }

    setTimeout(() => {

      this.selectedName = this.people[i].name.first + ' ' + this.people[i].name.last;
      this.selectedTitle = '/ ' + this.people[i].title;
      this.selectedBio = this.people[i].bio.html;

    }, 600);

    if (name) {
      setTimeout(() => {

        void name.clientLeft;
        void text.clientLeft;
        
        name.classList.remove('change');
        text.classList.remove('change');

        this._scrollToService
        .scrollTo({
          target: document.getElementById('bio'),
          offset: 100,
          easing: 'easeOutQuint',
          duration: 700
        });

      }, 600);
    }

    let names = document.querySelectorAll('#people p');
    _.each(names, (name: HTMLElement, ind: number) => {
      name.className = '';
      
      if(ind === i)
        name.className = 'active';
    });

  }

}
