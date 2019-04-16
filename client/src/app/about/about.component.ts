import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { DataService } from '../utils/data.service';

import * as ismobile from 'ismobilejs';
import * as _ from 'underscore';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewChecked {

  public isPhone: boolean;
  public submitted: boolean;
  public received: boolean;

  public people: any[];
  public hasContent: boolean;

  public selectedName: string;
  public selectedTitle: string;
  public selectedBio: string;

  private userForm: any;
  public peopleLoaded: boolean;

  constructor(private _dataSvc: DataService, private _formBuilder: FormBuilder) {
    
    this.isPhone = ismobile.phone;

    _dataSvc.getDataForUrl('/api/people/get').subscribe((data: any) => {

      this.people = data.peopleData;
      this.hasContent = true;

      
    });
    
  }
  
  ngOnInit() {
    this.userForm = this._formBuilder.group({
      'name': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'message': ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  
  ngAfterViewChecked() {

    if(this.peopleLoaded) return;
    
    this.getPerson(0);

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

    if(!this.people) return;
    
    // document.querySelector('#people .name').innerHTML = 
    // ' / <span>' +
    //  + '</span>';
    
    this.selectedName = this.people[i].name.first + ' ' + this.people[i].name.last;
    this.selectedTitle = this.people[i].title;

    this.selectedBio = this.people[i].bio.html;
    
    
    this.peopleLoaded = true;
    
    let names = document.querySelectorAll('#people p');
    _.each(names, (name: HTMLElement, ind: number) => {
      name.className = '';
      
      if(ind === i)
      name.className = 'active';
    })
  }

}
