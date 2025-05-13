import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'saourcesPipe'
})
export class SaourcesPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultItems = [];
    for(const item of value){
      if((item.name.indexOf(arg) > -1) ){
        resultItems.push(item);
      };
    };
    return resultItems;
  }

}
