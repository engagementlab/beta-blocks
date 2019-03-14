import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss']
})
export class ToolComponent implements OnInit {

  public mapType = 'default';
  public toolStep: number = 0;

  constructor() { }

  ngOnInit() {
  }

  nextStep() {
    this.toolStep++;
    this.mapType = 'sidewalk';
  }

}
