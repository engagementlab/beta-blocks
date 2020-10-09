import {
  Pipe,
  PipeTransform
} from '@angular/core';
import isMobile from 'ismobilejs';

@Pipe({
  name: 'deviceAction'
})
export class DeviceactionPipe implements PipeTransform {

  transform(value: any, args ? : any): any {
    return (isMobile(window.navigator.userAgent).tablet || isMobile(window.navigator.userAgent).phone) ? value.mobile : value.desktop;
  }

}