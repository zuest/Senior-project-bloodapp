import { Component  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
declare var google: any;
@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {
  private myInput: any;
  public map: any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation) {

  }

}
