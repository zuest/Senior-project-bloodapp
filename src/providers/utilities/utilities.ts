import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeGeocoder,
  NativeGeocoderReverseResult,
  NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import blood from 'blood-donor';

/*
  Generated class for the UtilitiesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilitiesProvider {

  constructor(public http: HttpClient,private _GEOCODE  : NativeGeocoder) {
    console.log('Hello UtilitiesProvider Provider');
  }
 matchBloodType(setNum:any){
   let bloodSet = {'1': 'O-ve',
     '2': 'O+ve',
     '3': 'A-ve',
     '4': 'A+ve',
     '5': 'B-ve',
     '6': 'B+ve',
     '7': 'AB-ve',
     '8': 'AB+ve'};

   return bloodSet[setNum];
 }

 isCapable(donorType,recipientType){
    console.log(donorType+"   "+recipientType)
    let result: any [] = [];
    let isCap:any = false;
   let donorBloodSet = {'1': 'O-ve',
     '2': 'O+ve',
     '3': 'A-ve',
     '4': 'A+ve',
     '5': 'B-ve',
     '6': 'B+ve',
     '7': 'AB-ve',
     '8': 'AB+ve'};

   let recipientBloodSet = {'1': 'O-',
     '2': 'O+',
     '3': 'A-',
     '4': 'A+',
     '5': 'B-',
     '6': 'B+',
     '7': 'AB-',
     '8': 'AB+'};

    blood(donorBloodSet[donorType], function (err, data) {
     console.log(" "+JSON.stringify(data.donors))
      result = data.donors;
   });
    result.forEach(type => {
      console.log(type +"   "+ recipientBloodSet[recipientType])
      if(type === recipientBloodSet[recipientType]){
        isCap = true;
        return;
      }
    })
    return !isCap;
 }

  reverseGeocode(lat, lng)
  {
    console.log("im in reverse  " + lat)
    return new Promise((resolve, reject) =>
    {
      this._GEOCODE.reverseGeocode(lat, lng).then((result : any) =>
        {
          resolve(result);
        })
        .catch((error: any) =>
        {
          console.log("this is error"+error)
          reject(error);
        });
    });
  }

   remove_duplicates_es6(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
  }

   removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject  = {};

    for(var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }
}
