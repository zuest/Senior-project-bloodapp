import { Component } from '@angular/core';
import {AlertController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {DataShareProvider} from "../../providers/data-share/data-share";
import {TwitterProvider} from "../../providers/twitter/twitter";
import {UtilitiesProvider} from "../../providers/utilities/utilities";
import {SocialSharing} from "@ionic-native/social-sharing";

@Component({
  selector: 'page-hospital-details',
  templateUrl: 'hospital-details.html',
})
export class HospitalDetailsPage {
  private name: any;
  private vicinity: any;
  private rating: any;
  users: any [] = [];
  private location: any;
  public placeId: any;
  public usersFromTwitter:any[]  = [];
  private tweets: any;
  constructor(
    public utilities:UtilitiesProvider,private socialSharing: SocialSharing,
    private navCtrl: NavController, private navParams: NavParams,
    public tweet: TwitterProvider,private fireStoreProvider:FirebaseProvider,
    public alertCtrl: AlertController, public fbProvider:FirebaseProvider,
    public dataShare:DataShareProvider,public utility:UtilitiesProvider,public viewCtrl: ViewController) {
  }

  fetchTwitter(){
    this.tweet.fetchDataFromTwitter().subscribe((data: any) => {
      this.users = [];
      this.tweets = data.tweets.statuses;
      this.usersFromTwitter = this.tweet.abstractDataFromTwitter(this.tweets);
      this.usersFromTwitter.forEach(data => {
        this.fireStoreProvider.getUserDataFromFirebaseByIdShort(data.userId).then(userData => {
          return this.fbProvider.getUserDataFromFirebase().then((currentUser) => {
            if(data.placeOfId === this.placeId.substr(this.placeId.length - 4)){

              userData.tweetDate = data.tweetDate
              userData.tweetId = data.tweetId
              userData.userId = data.userId // id of the recipient hes viewing
              userData.donorId = currentUser.id.substr(currentUser.id.length - 4) //current users id which he is considered to be the donor
              if( userData.userId ===  currentUser.id.substr(currentUser.id.length - 4)){
                console.log("matches")
              }
              else
              {
                if(this.utilities.isCapable(currentUser.group,userData.group)){
                  userData.capability = true;
                }
                else {
                  userData.capability = false;
                }
              this.users.push(userData)
              this.users = this.utility.remove_duplicates_es6(this.users);
              this.usersFromTwitter = []
              }
            }
          })
        }).catch(e => {
          console.log("Error", e.stack);
          console.log("Error", e.name);
          console.log("Error", e.message);
        })
      })
    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.fetchTwitter()
      if(refresher != 0)
      refresher.complete();
    }, 2000);
  }


  ionViewDidLoad() {
    this.name = this.navParams.get('param1');
    this.vicinity = this.navParams.get('param2');
    this.rating = this.navParams.get('param3');
    this.location = this.navParams.get('param4');
    this.placeId = this.navParams.get('param5');
    this.fetchTwitter()
  }
  dismiss() {
    return this.viewCtrl.dismiss();
  }


  regularShare(user){
    var msg = `a user urgently needs blood type of  ${this.utilities.matchBloodType(user.group)} please reply back to help! `
    this.socialSharing.share(msg, null, null, null);
  }
  whatsappShare(user){
    var msg = `a user urgently needs blood type of  ${this.utilities.matchBloodType(user.group)} please reply back to help! `
    this.socialSharing.shareViaWhatsApp(msg, null, null);
  }

  twitterShare(user){
    var msg = `a user urgently needs blood type of  ${this.utilities.matchBloodType(user.group)} please reply back to help! `
    this.socialSharing.shareViaTwitter(msg, null, null);
  }

  facebookShare(user){
    var msg = `a user urgently needs blood type of  ${this.utilities.matchBloodType(user.group)} please reply back to help! `
    this.socialSharing.shareViaFacebook(msg, null, null);
  }

  sendRequest(user){
    let confirm = this.alertCtrl.create({
      title: 'confirm to donate this person',
      message: 'by clicking agree, you accept you confirm that you will donate to this person blood \n DISCLAIMER: your contact info will be revealed to this recipient',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            user.placeId = this.placeId.substr(this.placeId.length - 4);
            return this.fbProvider.replyToTweet(user).then(() => {
              this.dismiss();
            })
          }
        }
      ]
    });
    return confirm.present();
  }
}
