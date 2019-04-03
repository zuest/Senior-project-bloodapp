import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HomePage} from "../home/home";
import {DonorsListPage} from "../donors-list/donors-list";

@IonicPage()
@Component({
  selector: 'page-recipient-tab',
  templateUrl: 'recipient-tab.html',
})
export class RecipientTabPage{
  homePage = HomePage;
  donlist=DonorsListPage;
  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecipientTabPage');
  }

}
