import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import * as ismobile from 'ismobilejs';
import { DataService } from '../utils/data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public isPhone: boolean;
  private userForm: any;

  constructor(private _dataSvc: DataService, private _formBuilder: FormBuilder) {
    
    this.isPhone = ismobile.phone;
    this.userForm = _formBuilder.group({
      'name': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'message': ['', [Validators.required, Validators.minLength(30)]]
    });
  
  }

  ngOnInit() {
  }

  submitForm() {

    console.log(this.userForm.value)

    this._dataSvc.sendDataToUrl('/api/contact', this.userForm.value).subscribe((data: any) => {


    });
  }

}
