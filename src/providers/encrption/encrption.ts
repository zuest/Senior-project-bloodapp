import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
/*
  Generated class for the EncrptionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EncrptionProvider {

  constructor(public http: HttpClient) {

  }

  public encryptData(data:any){
   return CryptoJS.AES.encrypt(data, 'secret key 123');
  }

  public decryptData(data:any){
    var bytes  = CryptoJS.AES.decrypt(data.toString(), 'secret key 123');
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  public hashData(data:any){
    return CryptoJS.MD5(data).toString();
  }
}
