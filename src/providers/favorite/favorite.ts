import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {FirebaseProvider} from "../firebase/firebase";
const ISDONOR = 'donor';
const ISRECIPIENT = 'recipient';

@Injectable()
export class FavoriteProvider {
  constructor(private storage: Storage,public fbProv:FirebaseProvider) {
  }
  RemoveKeyForDonorAndRecipient(){
   return this.storage.ready().then(() => {
       return this.storage.remove(ISDONOR);
      }).then(() => {
      return this.storage.remove(ISRECIPIENT);
    }).catch(function(e){
     console.log("Error", e.stack);
     console.log("Error", e.name);
     console.log("Error", e.message);
   });
  }


  setAsRecipient(){
    return this.fbProv.updateUserToken().then(() => {
      return this.RemoveKeyForDonorAndRecipient().then(() => {
        return this.storage.ready().then(() => {
          return this.storage.set(ISDONOR, "recipient").then(() =>{
          });
        });
      })
    }).catch(function(e){
      console.log("Error", e.stack);
      console.log("Error", e.name);
      console.log("Error", e.message);
    });
  }


  setAsDonor(){
    return this.fbProv.updateUserToken().then(() => {
      return this.RemoveKeyForDonorAndRecipient().then(() => {
        return this.storage.ready().then(() => {
          return this.storage.set(ISDONOR, "donor").then(() =>{
          });
        })
      })
    })

  }

  isDonor(){
      return this.storage.ready().then(() => {
        return this.storage.get(ISDONOR).then((key) => {
          if (key === "donor"){
            return true;
          }
          else {
            return false;
          }
        })
      });
  }

  isRecipient(){
    return this.storage.ready().then(() => {
      this.storage.get(ISRECIPIENT).then((key) => {
        if(key === "recipient") {
          return true;
        }
        else
          return false;
      })
    });
  }

}
