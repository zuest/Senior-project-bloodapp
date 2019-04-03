import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LZStringService} from "ng-lz-string";

/*
  Generated class for the CompressionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CompressionProvider {

  constructor(public http: HttpClient,private lz: LZStringService) {
    console.log('Hello CompressionProvider Provider');
  }

  public compressData(data){
    return this.lz.compress(data);
  }
  public deCompressData(data){
    this.lz.decompress(data);
  }
}
