import {Component, ViewChild} from '@angular/core';
import {MenuController, NavController, Slides} from 'ionic-angular';
import {login} from '../login/login';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class Intro {
  showSkip = true;
  @ViewChild('slides') slides: Slides;
  constructor(   public navCtrl: NavController,
                 public menu: MenuController,) {

  }
  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }
  ionViewWillEnter() {
    this.slides.update();
  }
  goToHome(){
    this.navCtrl.setRoot(login);
  }

}
