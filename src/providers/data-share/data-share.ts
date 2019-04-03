import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DataShareProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataShareProvider {
public usersFromTwitter:any;
  sharedTweets: any;
  constructor(public http: HttpClient) {
    console.log('Hello DataShareProvider Provider');
  }

}
