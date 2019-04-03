import {Component, Renderer} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the CustomAlertModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-custom-alert-modal',
  templateUrl: 'custom-alert-modal.html',
})
export class CustomAlertModalPage {

  constructor(
    params: NavParams,
    public renderer: Renderer,
    public viewCtrl: ViewController
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomAlertModalPage');
  }

}
