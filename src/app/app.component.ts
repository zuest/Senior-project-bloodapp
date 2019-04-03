///<reference path="../providers/firebase/firebase.ts"/>
import {Platform, LoadingController, NavController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {login} from '../pages/login/login';
import {Intro} from '../pages/intro/intro';
import {AngularFireAuth} from 'angularfire2/auth';
import {FavoriteProvider} from "../providers/favorite/favorite";
import {RecipientFillingPage} from "../pages/recipient-filling/recipient-filling";
import {ChoicePage} from "../pages/choice/choice";
import {TabsPage} from "../pages/tabs/tabs";
import {Component, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';
import {CompleteDonationPage} from "../pages/complete-donation/complete-donation";
import {FirebaseProvider} from "../providers/firebase/firebase";
import {MenuPage} from "../pages/menu/menu";
import {TwitterProvider} from "../providers/twitter/twitter";
import {DataShareProvider} from "../providers/data-share/data-share";
import {UtilitiesProvider} from "../providers/utilities/utilities";
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { mergeMap, catchError } from 'rxjs/operators';

export interface user {
  placeOfId:string,
  userId:string,
  screenName:string
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') nav: NavController
  rootPage: any;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public fcm: FCM,
              public loadingCtrlc: LoadingController,
              public localStorage: Storage,
              afAuth: AngularFireAuth,
              typeProvider: FavoriteProvider,
              public fbProv: FirebaseProvider,
              public tweet: TwitterProvider,
              public datashare: DataShareProvider, public utilities: UtilitiesProvider) {
    platform.ready().then(data => {
    const authObserver = afAuth.authState.subscribe(user => {
        fromPromise(this.localStorage.get('introShown')).subscribe(result => {
                if (user) {
                  fromPromise(typeProvider.isDonor()).subscribe((resultOne) => {
                    //     return typeProvider.isRecipient().then(secondResult => {
                    if (resultOne) {
                      this.rootPage = ChoicePage;
                    }
                    else if (!resultOne) {
                      this.rootPage = ChoicePage;
                    }
                  })
                }
                     else {
                       if (result){
                         this.rootPage = login;
                       }
                       else {
                         this.rootPage = Intro;
                         return this.localStorage.set('introShown', true)
                       }
                  }

              fcm.onNotification().subscribe(data => {
                if (data.wasTapped) {
                  alert("a donor is willing to donate to you, for more info navigate to the donors lists below!")

                  if(data.clientId === 'null'){

                    this.nav.push(CompleteDonationPage,{
                      recipientId:data.recipientId,
                      recipientToken:data.recipientToken
                    });
                  }
                  //Notification was received on device tray and tapped by the user.
                }
                else {
                  alert("a donor is willing to donate to you, for more info navigate to the donors lists below!")
                  if(data.clientId === 'null'){
                    this.nav.push(CompleteDonationPage,{
                      recipientId:data.recipientId,
                      recipientToken:data.recipientToken
                    });
                  }
                  //Notification was received in foreground. Maybe the user needs to be notified.
                }
              })
              fcm.onTokenRefresh().subscribe(token => {
                fbProv.updateUserToken();
              })
            });
              //this.loader.dismiss();
        })

      // platform.ready().then(() => {
      //   this.localStorage.get('introShown').then((result) => { // if introduction page as
      //     statusBar.styleDefault();
      //     splashScreen.hide();
      //      return authObserver.then(user => { // if authentication
      //        console.log("user  " +user)
      //       if (user) {
      //         return typeProvider.isDonor().then((resultOne) => {
      //           return typeProvider.isRecipient().then(secondResult => {
      //             if (resultOne) {
      //               this.rootPage = MenuPage;
      //             }
      //             else if (secondResult){
      //               this.rootPage = RecipientFillingPage;
      //
      //             }
      //             else {
      //               this.rootPage = ChoicePage;
      //
      //             }
      //           })
      //         })
      //       }
      //       else {
      //         this.rootPage = login;
      //       }
      //
      //     if (result){
      //       this.rootPage = login;
      //     }
      //     else {
      //       this.rootPage = Intro;
      //       return this.localStorage.set('introShown', true)
      //     }
      //     //this.loader.dismiss();
      //   })
      //   })
      //     .then(() => {
      //     fcm.onNotification().subscribe(data => {
      //       if (data.wasTapped) {
      //         alert("a donor is willing to donate to you, for more info navigate to the donors lists below!")
      //         if(data.clientId === 'null'){
      //           this.nav.push(CompleteDonationPage,{
      //             recipientId:data.recipientId,
      //             recipientToken:data.recipientToken
      //           });
      //         }
      //         //Notification was received on device tray and tapped by the user.
      //       }
      //       else {
      //         alert("a donor is willing to donate to you, for more info navigate to the donors lists below!")
      //         if(data.clientId === 'null'){
      //           this.nav.push(CompleteDonationPage,{
      //             recipientId:data.recipientId,
      //             recipientToken:data.recipientToken
      //           });
      //         }
      //         //Notification was received in foreground. Maybe the user needs to be notified.
      //       }
      //     })
      //     fcm.onTokenRefresh().subscribe(token => {
      //       fbProv.updateUserToken();
      //     })
      //   });
      //   })
//////
      statusBar.styleDefault();
      splashScreen.hide();
    })

  }
}


