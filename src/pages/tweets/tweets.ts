import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TwitterProvider} from "../../providers/twitter/twitter";
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import {DataShareProvider} from "../../providers/data-share/data-share";

/**
 * Generated class for the TweetsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tweets',
  templateUrl: 'tweets.html',
})

export class TweetsPage {
  public rawTweetsFromApi: any;
public abstractedInfoFromTweets:any[] = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public tweet: TwitterProvider,
              public nativeGeocoder: NativeGeocoder,
              public datashare:DataShareProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TweetsPage');
    this.datashare.sharedTweets = this.rawTweetsFromApi;
  }


}
