import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import {HttpClient} from "@angular/common/http";

/**
 * Generated class for the CompleteDonationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complete-donation',
  templateUrl: 'complete-donation.html',
})
export class CompleteDonationPage {
  public userCode:any;
   public recipientId: any = 'null';
   public code;
  public user: any = {};
  private recipientToken: any;

  constructor(public http: HttpClient,private launchNavigator: LaunchNavigator,public navCtrl: NavController,public firebaseProv:FirebaseProvider, public navParams: NavParams,private barcodeScanner:BarcodeScanner) {

  }
  ionViewDidLoad() {
    this.user =  this.navParams.get("user");
    this.userCode =  this.navParams.get("id");
    this.recipientId =  this.navParams.get("recipientId");
    this.recipientToken =  this.navParams.get("recipientToken");
    if (this.recipientId){
      this.user = {otherSide:""}
      this.user.recipientToken = this.recipientToken;
      this.user.otherSide = "valid";
    }
    return this.firebaseProv.getUserIdByEmail().then((id) => {
      if (!this.userCode){
        this.code = this.recipientId; // if i pass recipient id, it means its from the second user
      }
      else{
        this.code = id;
      }
    })
  }

  navigateToHospital(){
    this.launchNavigator.navigate('Toronto, ON')
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }


  scanCode(){
    this.barcodeScanner.scan().then(barcodeData => {
    let scannedCode = barcodeData.text;
      if(scannedCode === this.code){
      alert("donation completed!")
          const completionUrl = 'https://us-central1-blood-don.cloudfunctions.net/completeDonation/';
          return new Promise((resolve, reject) => {
            console.log(this.user)
            this.http.post(completionUrl, this.user) // to make notification
              .subscribe(res => {
                resolve(res);
              }, (e) => {
                console.log("Error", e.stack);
                console.log("Error", e.name);
                console.log("Error", e.message);
                reject(e);
              });
          })
      }
      else{
        alert("error incorrect barcode!")
      }
    }, (err) => {
      console.log('Error: ', err);
    });
  }
}
