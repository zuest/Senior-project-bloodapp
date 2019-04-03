import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import * as firebase from "firebase";
import {FCM} from "@ionic-native/fcm";
import { HttpClient } from '@angular/common/http';
import {EncrptionProvider} from "../encrption/encrption";
import {CompressionProvider} from "../compression/compression";
import {UtilitiesProvider} from "../utilities/utilities";
import {user} from "../../app/app.component";

export interface Item {
  firstname:string,
  surname:string,
  date:string,
  email: string,
  password: string,
  group:string,
  phoneNum:number,
  location:any,
  timestamp:any,
  token:any,
}

export interface User {
email:string,
  uid:string,
}

export interface hospital {
  hospitalCountry:string,
  hospitalId:string,
  hospitalLocation:string,
  hospitalName:string
}

@Injectable()
export class FirebaseProvider {
  public results:any;
  public userProfile: any;
  public currentUser: User;
  private itemsCollection: AngularFirestoreCollection<Item>;
  private hospitalsCollection: AngularFirestoreCollection<hospital>;
  hospitals:Observable<hospital[]>;
  items: Observable<Item[]>;
  public db = firebase.firestore();



  constructor(public afAuth: AngularFireAuth,
              public afs: AngularFirestore,
              public fcm: FCM,
              public http: HttpClient,
              public encrypt:EncrptionProvider,
              public compress:CompressionProvider,
              public utilities:UtilitiesProvider) {

    this.itemsCollection = afs.collection<Item>('userProfile');
    this.items = this.itemsCollection.valueChanges();
    this.hospitalsCollection = afs.collection<hospital>('hospitals');
    this.hospitals = this.hospitalsCollection.valueChanges();
    afAuth.auth.onAuthStateChanged(user => {
      if (user) { //if there is a user authenticated
        this.currentUser = {
          email:user.email,
          uid:user.uid,
        };
      }
    });

  }


  getUserDataFromFirebase(){
    let currentUSERemail = this.currentUser.email; // for a strange reason i have to do this?
    let userReference;
    try {
      userReference = this.db.collection("userProfile")
    }
    catch (e) {
      console.log("Error", e.stack);
      console.log("Error", e.name);
      console.log("Error", e.message);
    }
    return userReference.get().then(function(querySnapshot) {
      let data:any;
      querySnapshot.forEach(function(doc) {
        if(doc.data().email.toLowerCase()  ===  currentUSERemail.toLowerCase() ){
          data =  doc.data()
          data.id = doc.id;
        }
      });
      return data;
    });
  }

  getUserDataFromFirebaseById(userId) : any {
    let userReference = this.db.collection("userProfile");
    return userReference.get().then(function(querySnapshot) {
      let data:any;
      querySnapshot.forEach(function(doc) {
        if(doc.id  ===  userId ){
          data =  doc.data()
          data.id = doc.id;
        }
      });
      return data;
    });
  }

  getUserDataFromFirebaseByIdShort(userId) : any {
    let userReference = this.db.collection("userProfile");
    return userReference.get().then(function(querySnapshot) {
      let data:any;
      querySnapshot.forEach(function(doc) {
        if(doc.id.substr(doc.id.length - 4)  ===  userId ){
          data =  doc.data()
          data.id = doc.id;
        }
      });
      return data;
    });
  }

  loginUser(newEmail: string, newPassword: string){
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
  }


  setResult(res){
    this.results = res;
  }


getUserIdByEmail():any{
  let userDbReference:any;
  let tempEmail = this.currentUser.email;
  let userId:any;
  try {
    userDbReference = this.db.collection("userProfile")
  }
  catch (e) {
    console.log("Error", e.stack);
    console.log("Error", e.name);
    console.log("Error", e.message);
  }
    return userDbReference.get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      if(doc.data().email.toLowerCase()  ===  tempEmail.toLowerCase()){
        userId = doc.id;
      }
    });
      return userId
  }).catch(function(e){
    console.log("Error ", e.stack);
    console.log("Error ", e.name);
    console.log("Error ", e.message);
  });

}

    updateUserToken(){
      let tempUser;
      let database;
      let email = this.currentUser.email;
      let db = this.db;
      let fc = this.fcm; // strange reason inner functions must do this.
      try {
        tempUser = this.db.collection("userProfile")
        return tempUser.get().then(function(querySnapshot){
          querySnapshot.forEach(function(doc){
            console.log((doc.data().email.toLowerCase()  +"     " + email.toLowerCase()))
            console.log((doc.data().email.toLowerCase()  ===  email.toLowerCase()))
            if(doc.data().email.toLowerCase()  ===  email.toLowerCase() ){

              database = db.collection("userProfile").doc(doc.id)
              return database.get().then(docSnapshot => {
                if (docSnapshot.exists) {
                  return fc.getToken().then(token => {
                    return database.update({
                      token:token
                    })
                  })
                }
              });
            }
          });
        }).catch(function(e){
          console.log("Error", e.stack);
          console.log("Error", e.name);
          console.log("Error", e.message);
        });
      }
      catch (e) {
        console.log("Error", e.stack);
        console.log("Error", e.name);
        console.log("Error", e.message);
      }
  }

  replyToTweet(user){
    let notificationUrl = 'https://us-central1-blood-don.cloudfunctions.net/addMessage/'; // to notify the user that was clicked
    let replyApiUrl = 'https://us-central1-blood-don.cloudfunctions.net/replyToTweet/';
    return new Promise((resolve, reject) => {
      this.http.post(notificationUrl, user).subscribe(res => {
          resolve(res);
        }, (e) => {
          console.log("Error", e.stack);
          console.log("Error", e.name);
          console.log("Error", e.message);
          reject(e);
        });
    }).then(() => {
    return new Promise((resolve, reject) => {
      this.http.post(replyApiUrl, user)
        .subscribe(res => {
          resolve(res);
        }, (e) => {
          console.log("Error", e.stack);
          console.log("Error", e.name);
          console.log("Error", e.message);
          reject(e);
        });
    });
  })
  }

  createAnTweet(hospitalName, event, location, placeId, userdata: any, LocationInformation: any) {
    let postTweetUrl = 'https://us-central1-blood-don.cloudfunctions.net/postTweet';
    let Bloodgroup = this.utilities.matchBloodType(userdata.group);
    let tweetRespond = {
        locationInfo:LocationInformation,
        userData:userdata,
        hospitalName:hospitalName,
        event:event,
        placeId: placeId,
        bloodGroup:Bloodgroup,
      };
      return new Promise((resolve, reject) => {
        this.http.post(postTweetUrl, tweetRespond)
          .subscribe(res => {
            resolve(res);
          }, (e) => {
            console.log("Error", e.stack);
            console.log("Error", e.name);
            console.log("Error", e.message);
            reject(e);
          });
      });
  }

  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser() {
    return this.afAuth.auth.signOut();
  }

  // emailVerify(): firebase.Promise<any> {
  //   return this.afAuth.auth.currentUser.sendEmailVerification().then(res => {
  //     console.log("vertification sent!")
  //   },(err) => {
  //     console.log(err)
  //   });
  // }





  signupUser(firstname:string,surname:string,date:string,email: string, password: string,group:string,phoneNum:number,location:any){
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(()=>{
      return this.fcm.getToken().then(token => { // wont work unless its on real app.
          return this.itemsCollection.add({
            firstname,
            surname,
            date,
            email,
            password,
            group,
            phoneNum,
            location: new firebase.firestore.GeoPoint(location.latitude, location.longitude),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            token
          });
        })
      }).catch(e => {
      console.log("Error", e.stack);
      console.log("Error", e.name);
      console.log("Error", e.message);
    });
  }
}
