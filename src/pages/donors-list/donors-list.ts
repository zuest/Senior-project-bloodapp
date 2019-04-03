import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TwitterProvider} from "../../providers/twitter/twitter";
import {CallNumber} from "@ionic-native/call-number";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {UtilitiesProvider} from "../../providers/utilities/utilities";
import {CompleteDonationPage} from "../complete-donation/complete-donation";
import {HttpClient} from "@angular/common/http";

/**
 * Generated class for the DonorsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-donors-list',
  templateUrl: 'donors-list.html',
})
export class DonorsListPage {
  public AbstractTweet: any[] = [];
  public url = "assets/images/image1.png"
  public url1 = "assets/images/image2.png"
  public url2 = "assets/images/image4.png"
  public url3 = "assets/images/image5.png"
  public url5 = "assets/images/image6.png"
  public url6 = "assets/images/image7.png"
  public url7 = "assets/images/image8.png"
  public url8= "assets/images/image9.png"
  public recipientTweet:any[]  = [];
  constructor(public navCtrl: NavController,public utility:UtilitiesProvider, public http: HttpClient,public fbProvider:FirebaseProvider, public navParams: NavParams, public twitterProv:TwitterProvider,private callProvider: CallNumber) {
  }
  ionViewDidLoad() {//ll
    console.log(JSON.stringify(this.AbstractTweet))
    this.fetchTweets();
  }

  launchDialer(n:string):any{
    return this.callProvider.callNumber(n, true)
      .catch((e) => {
        console.log("Error", e.stack);
        console.log("Error", e.name);
        console.log("Error", e.message);
      });
  }

  fetchTweets(){
    let tweetId: any;
    this.twitterProv.fetchDataFromTwitter().subscribe((data) => { // get all requests from twitter
      this.twitterProv.fetchRepliesFromTwitter().subscribe((response: any) => {  // get all replies to the requests from twitter
       // console.log("response  "+JSON.stringify(response))
        return this.fbProvider.getUserDataFromFirebase().then(user => { // gets logged in users data
          this.recipientTweet = data.tweets.statuses; // get the context of the requests
          this.recipientTweet.forEach(tweet => {
            let indexStartForToken;
            let indexEndForToken;
            indexStartForToken = tweet.full_text.indexOf('user id:"');
            indexEndForToken = tweet.full_text.indexOf('"*');
            let userId = tweet.full_text.slice(indexStartForToken + 9, indexEndForToken) // gets id of requesters
            console.log("vvv"+ (userId === user.id.substr( user.id.length - 4)))
            console.log("vvv"+ (userId +"   "+ user.id.substr( user.id.length - 4)))
            if (userId === user.id.substr( user.id.length - 4)) { // compare id of requesters with current logged in users id
              console.log("this one tweet "+JSON.stringify(tweet))
              tweetId = tweet.id_str; // assign request tweet id if the request tweet has that current logged in user.
              console.log("current logged"+JSON.stringify(tweetId))
            }
          })

          response.tweets.statuses.forEach(data => { //  iterate over user replies on twitter
            console.log("RES"+JSON.stringify(data))
            let indexStart = data.full_text.indexOf('place Id "');
            let indexEnd = data.full_text.indexOf('";');
            let donorId = data.full_text.slice(indexStart + 10, indexEnd) // get id of the user who replied (donor)
            console.log("this donor id ok "+donorId)
            return this.fbProvider.getUserDataFromFirebaseByIdShort(donorId).then(userData => { // get users data for who replied
              console.log("BEEP "+(data.in_reply_to_status_id_str === tweetId))
              console.log("BEEP "+data.in_reply_to_status_id_str +"     "+ tweetId)
              if (data.in_reply_to_status_id_str === tweetId){ // find the tweet that replies to the request
                userData.tweetId = tweetId;
                userData.replyTweetId = data.id_str;
                this.AbstractTweet.push(userData)
                this.AbstractTweet = this.utility.removeDuplicates(this.AbstractTweet,"email");
              }
            })
          })
        }, e => {
          console.log("Error", e.stack);
          console.log("Error", e.name);
          console.log("Error", e.message);
        })
      })
    })
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.fetchTweets()
      if(refresher != 0)
        refresher.complete();
    }, 5000);
  }
  confirmUser(user){
    return this.fbProvider.getUserDataFromFirebase().then(recipientUser => { //recipient user is the current user
    let tempUserId = user.id;
    user.recipientId = recipientUser.id;
    user.recipientToken = recipientUser.token
    const apiUrl = 'https://us-central1-blood-don.cloudfunctions.net/addMessage/';
    return new Promise((resolve, reject) => {
      delete user.id;
      this.http.post(apiUrl, user).subscribe(res => {
          resolve(res);
        }, (e) => {
          console.log("Error", e.stack);
          console.log("Error", e.name);
          console.log("Error", e.message);
          reject(e);
        });
    }).then(() => {
       this.navCtrl.push(CompleteDonationPage,{
        id:tempUserId,
         user:user
      })
    })
    })
  }

}
