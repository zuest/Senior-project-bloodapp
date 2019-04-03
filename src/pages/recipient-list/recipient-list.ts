import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {TwitterProvider} from "../../providers/twitter/twitter";
import {UtilitiesProvider} from "../../providers/utilities/utilities";


@Component({
  selector: 'page-recipient-list',
  templateUrl: 'recipient-list.html',
})
export class RecipientListPage {

  private name: any;
  private vicinity: any;
  private rating: any;
  public users: any [] = [];
  private location: any;
  public placeId: any;
  public usersFromTwitter:any[]  = [];
  private tweets: any;
  constructor(public navCtrl: NavController,public utilities:UtilitiesProvider, public navParams: NavParams,public tweet: TwitterProvider,public fireStoreProvider:FirebaseProvider,public alertCtrl: AlertController) {

  }

  fetchTwitter(){
    this.tweet.fetchDataFromTwitter().subscribe((data: any) => {
      this.users = [];
      this.tweets = data.tweets.statuses;
      this.usersFromTwitter = this.tweet.abstractDataFromTwitter(this.tweets);
      this.usersFromTwitter.forEach(data => {
        this.fireStoreProvider.getUserDataFromFirebaseByIdShort(data.userId).then(userData => {
          return this.fireStoreProvider.getUserDataFromFirebase().then((currentUser) => {
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
                this.users = this.utilities.remove_duplicates_es6(this.users);
                this.usersFromTwitter = []
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

  ionViewDidLoad() {
    this.fetchTwitter()
  }


  sendRequest(user){
    let confirm = this.alertCtrl.create({
      title: 'confirm to donate this person',
      message: 'by clicking agree you accept you confirm that you will donate to this person blood',
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
            return this.fireStoreProvider.replyToTweet(user.userToken);
          }
        }
      ]
    });
    return confirm.present();
  }

}
