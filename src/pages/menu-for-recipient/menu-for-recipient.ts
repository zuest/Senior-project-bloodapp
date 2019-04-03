import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Nav, LoadingController} from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {login} from "../login/login";
import {TweetsPage} from "../tweets/tweets";
import {ChoicePage} from "../choice/choice";
import {RecipientTabPage} from "../recipient-tab/recipient-tab";

export interface PageInterface {
  title: string;
  pageName?: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@IonicPage()
@Component({
  selector: 'page-menu-for-recipient',
  templateUrl: 'menu-for-recipient.html',
})
export class MenuForRecipientPage {
  @ViewChild(Nav) nav: Nav;
  rootPage = RecipientTabPage;

  pages: PageInterface[] = [
    { title: 'Logout',index: 1, icon: 'log-out' },
    { title: 'Change role', index: 3, icon: 'logo-twitter' },
  ];
  constructor(public navCtrl: NavController, public fbProvider:FirebaseProvider,public loadingCtrl: LoadingController) { }

  openPage(page:PageInterface){
    if (page.index === 1) { // if button of the page pressed is the logout button.
      let loading = this.loadingCtrl.create({content : "logging out,please wait..."});
      return this.fbProvider.logoutUser().then(() => {
        return this.navCtrl.setRoot(login, {}, {animate: true, direction: 'back'}).then(() => {
          loading.dismissAll();
          return this.navCtrl.popToRoot({animate: true, direction: 'back'})
        })
      })
    }
    else if(page.index === 3){
      let loading = this.loadingCtrl.create({content : "loading ,please wait..."});
      loading.present();
      return this.navCtrl.setRoot(ChoicePage, {}, { animate: true, direction: 'back' }).then(() => {
        loading.dismissAll();
        return this.navCtrl.popToRoot({ animate: true, direction: 'back' })
      })
    }
  }
}
