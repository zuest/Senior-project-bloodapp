import { Component } from '@angular/core';
import {NavController } from 'ionic-angular';
import {HomePage} from "../home/home";
import {RecipientListPage} from "../recipient-list/recipient-list";
import {FavoriteProvider} from "../../providers/favorite/favorite";
import {DonorsListPage} from "../donors-list/donors-list";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  mapPage = HomePage;
  RecipientList=RecipientListPage;
  donorList=DonorsListPage;
  public isDon:any;
  constructor(public navCtrl: NavController,public RoleProvider:FavoriteProvider) {
  }
  ionViewDidLoad(){
    this.RoleProvider.isDonor().then(isDonor => {
      this.isDon = isDonor
      console.log(this.isDon)
    })
  }
}
