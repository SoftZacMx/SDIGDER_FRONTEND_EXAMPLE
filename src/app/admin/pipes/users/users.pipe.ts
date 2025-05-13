import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usersPipe'
})
export class UsersPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultItems = [];
    for(const item of value){
      if((item.name.indexOf(arg) > -1) || (item.last_name.indexOf(arg) > -1) || (item.second_last_name.indexOf(arg) > -1) ){
        resultItems.push(item);
      };
    };
    return resultItems;
  }

}
