import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linebreak'
})
export class LinebreakPipe implements PipeTransform {

  transform(value: string, args?: any): string { 
    let val = value.replace(/\\n/g, '<br />');
    console.log(val)
    return val;
  }

}
