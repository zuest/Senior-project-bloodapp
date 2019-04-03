import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {UtilitiesProvider} from "../../providers/utilities/utilities";
import {DonorsListPage} from "../donors-list/donors-list";

@Component({
  selector: 'page-recipient-filling',
  templateUrl: 'recipient-filling.html',
})
export class RecipientFillingPage {
  private hospitalName: any;
  private vicinity: any;
  private rating: any;
  private location: any;
  private placeId: any;
  public myDate:any = new Date();
  constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams, public firestoreDb: FirebaseProvider, public loadingCtrl: LoadingController, public utilities: UtilitiesProvider) {
  }

  ionViewDidLoad() {
    this.myDate.setHours(this.myDate.getHours() + 3);
// now you can get the string
    this.myDate = this.myDate.toISOString();
    this.hospitalName = this.navParams.get('param1');
    this.vicinity = this.navParams.get('param2');
    this.rating = this.navParams.get('param3');
    this.location = this.navParams.get('param4');
    this.placeId = this.navParams.get('param5');
    console.log("location: is what we got " + this.location + " this id " + this.placeId);
  }

  public event = {
    month: " ",
    timeStarts:  " "
  }


  dismiss() {
    return this.viewCtrl.dismiss();
  }

  addUser() {
    this.event.month =  this.myDate.substr(0, 10),
      this.event.timeStarts =  this.myDate.substr(11, 5)
    let loading = this.loadingCtrl.create({content: "loading ,please wait..."});
    //loading.present();
    return this.utilities.reverseGeocode(25.3754, 51.4887).then((LocationInformation: any) => {
      let locInfo = LocationInformation[0];
      return this.firestoreDb.getUserDataFromFirebase().then(userData => {
        return this.firestoreDb.createAnTweet(this.hospitalName, this.event, this.location, this.placeId, userData, locInfo).then(() => {
          return this.dismiss()
        })
      }).catch(e => {
        console.log("Error", e.stack);
        console.log("Error", e.name);
        console.log("Error", e.message);
    })
  })
  }
}


