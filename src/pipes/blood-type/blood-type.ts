import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the BloodTypePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'bloodTypePipe',
})
export class BloodTypePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return this.matchBloodType(value);
  }

  matchBloodType(setNum:any){
    let bloodSet = {'1': 'O negative',
      '2': 'O positive',
      '3': 'A negative',
      '4': 'A positive',
      '5': 'B negative',
      '6': 'B positive',
      '7': 'AB negative',
      '8': 'AB positive'};

    return bloodSet[setNum];
  }
}
