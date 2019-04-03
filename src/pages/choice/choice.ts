	import { Component } from '@angular/core';
	import {LoadingController, NavController} from 'ionic-angular';
	import {FavoriteProvider} from "../../providers/favorite/favorite";
	import {HomePage} from "../home/home";
	import {MenuPage} from "../menu/menu";
	import {FirebaseProvider} from "../../providers/firebase/firebase";
	import {TwitterProvider} from "../../providers/twitter/twitter";
	import {TweetsPage} from "../tweets/tweets";
	import {UtilitiesProvider} from "../../providers/utilities/utilities";
	import {RecipientTabPage} from "../recipient-tab/recipient-tab";

	@Component({
		selector: 'page-choice',
		templateUrl: 'choice.html',
	})
	export class ChoicePage{
		constructor(public navCtrl: NavController, public RoleProvider:FavoriteProvider,public loadingCtrl: LoadingController,
								public twitter:TwitterProvider,public utilities:UtilitiesProvider,public fbProv:FirebaseProvider) {
		}


	 becomeDonor() : any{
		 let loading = this.loadingCtrl.create({content : "loading ,please wait..."});
		 loading.present();
		 this.fbProv.getUserDataFromFirebase().then((user:any) =>{
			 this.RoleProvider.setAsDonor().then(() => {

				 return this.navCtrl.setRoot(MenuPage, {}, { animate: true, direction: 'forward' }).then(() => {
					 loading.dismissAll();
					 return this.navCtrl.popToRoot({ animate: true, direction: 'forward' })
				 });
			 })
		 } )
	 }
	 becomeRecipient() : any{
			let loading = this.loadingCtrl.create({content : "loading ,please wait..."});
				loading.present();
		 this.RoleProvider.setAsRecipient().then(()=>{
			 return this.navCtrl.setRoot(MenuPage, {}, { animate: true, direction: 'forward' }).then(() => {
				 loading.dismissAll();
				 return this.navCtrl.popToRoot({ animate: true, direction: 'forward' })
			 })
		 })
	 }
	}
