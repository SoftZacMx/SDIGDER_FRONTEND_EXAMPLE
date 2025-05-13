import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productsPipe'
})
export class ProductsPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultItems = [];
    for(const item of value){
      if((item.name.indexOf(arg) > -1)  ){
        resultItems.push(item);
      };
    };
    return resultItems;
  }

}
