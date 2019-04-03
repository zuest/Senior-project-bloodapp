import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Nav, LoadingController} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {login} from "../login/login";
import {TweetsPage} from "../tweets/tweets";
import {ChoicePage} from "../choice/choice";

export interface PageInterface {
  title: string;
  pageName?: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  @ViewChild(Nav) nav: Nav;
  twitterPage = TweetsPage;
  rootPage = TabsPage;

  pages: PageInterface[] = [
    { title: 'Logout',index: 1, icon: 'log-out' },
    { title: 'Tweet requests', index: 2, icon: 'logo-twitter' },
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
        }).then(() => {
          return this.fbProvider.logoutUser();
        })
      })
    }
    else if(page.index === 2){
      let loading = this.loadingCtrl.create({content : "loading ,please wait..."});
      loading.present();
      return this.navCtrl.push(this.twitterPage).then(()=>{
        loading.dismissAll();
      });
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
