import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DataService } from '../utils/data.service';

import * as AOS from 'aos';

@Component({
  selector: 'app-tech',
  templateUrl: './tech.component.html',
  styleUrls: ['./tech.component.scss']
})
export class TechComponent implements OnInit, AfterViewInit {

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
      'loc': ['', [Validators.required]],
      'message': ['', [Validators.required]],
      'email': ['', [Validators.email]]
    });

    AOS.init({
      duration: 700,
      easing: 'ease-in-out'
    });

  }

  ngAfterViewInit() {

    // A little hack to show 'required' label on inputs
    for(let id in this.userForm.controls) {
      if(this.userForm.controls[id].errors && this.userForm.controls[id].errors.required) {

        let errorEl = (document.querySelector("span[data-field='"+ id +"'") as HTMLElement);
        let targetEl = document.getElementById(id);
        let targetWidth = targetEl.clientWidth;
        let offsetWidth = targetWidth-(errorEl.clientWidth/2);
        
        // Make error span width of input field
        errorEl.style.width = offsetWidth + 'px';
        errorEl.style.display = 'block';
      }
      
    }

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.userForm.controls;
  }

  submitForm() {
    this.submitted = true;

    // A little hack to get error inside input fields
    for(let id in this.userForm.controls) {
      if(this.userForm.controls[id].invalid || this.userForm.controls[id].errors !== null) {

        let errorEl = (document.querySelector("span[data-field='"+ id +"'") as HTMLElement);
        let targetEl = document.getElementById(id);
        let targetWidth = targetEl.clientWidth;
        let offsetWidth = targetWidth-errorEl.clientWidth;
        
        // Make error span width of input field
        errorEl.style.width = offsetWidth + 'px';
        errorEl.style.display = 'block';
        targetEl.classList.add('error');
      }
      
    }
    
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

  public formClear(target: HTMLElement) {
    
    let errorEl = (document.querySelector("span[data-field='"+ target.id +"'") as HTMLElement);
    
    errorEl.style.display = 'none';
    target.classList.remove('error');

  }

}
