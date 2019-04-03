import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {ChoicePage} from '../choice/choice';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {HomePage} from '../../pages/home/home'
import {FirebaseProvider} from '../../providers/firebase/firebase'
import {FavoriteProvider} from "../../providers/favorite/favorite";
import {RecipientFillingPage} from "../recipient-filling/recipient-filling";

/**
 * Generated class for the SignUpSecondPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'sign-up-second',
  templateUrl: 'sign-up-second.html',
})
export class SignUpSecondPage {
  form: FormGroup;
  firstname: string = "";
  surname: string = "";
  myDate: string = "";
  phoneNum: number = 0;
  lat: number = 0;
  lng: number = 0;
   gpsOptions = {maximumAge: 30000, timeout: 5000, enableHighAccuracy: true};
  public simpleColumns: any[];
  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              private geolocation: Geolocation,
              private fba: FirebaseProvider, public favProvider: FavoriteProvider) {
    this.firstname = navParams.get('firstName');
    this.surname = navParams.get('surname');
    this.myDate = navParams.get('myDate');
    this.phoneNum = navParams.get('phoneNum');
    this.simpleColumns = [
      {
        name: 'col1',
        options: [
          {text: 'O negative', value: '1'},
          {text: 'O positive', value: '2'},
          {text: 'A negative', value: '3'},
          {text: 'A positive', value: '4'},
          {text: 'B negative', value: '5'},
          {text: 'B positive', value: '6'},
          {text: 'AB negative', value: '7'},
          {text: 'AB positive', value: '8'},
        ]
      }
    ];
    this.form = formBuilder.group({
      group: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmpassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  onLocateUser() {
    return this.geolocation.getCurrentPosition(this.gpsOptions).then((location) => {
      return location.coords;
    })
      .catch((error) => console.log('An error has ocurced', JSON.stringify(error)))
  }

  registerUser(form: FormGroup) {
    let loading = this.loadingCtrl.create({content : "Loading ,please wait..."});
    if (form.valid) {
      if (form.value.password != form.value.confirmpassword) {
        this.toastCtrl.create({message: 'Password is incorrect. Confirm your password again.', duration: 4500})
          .present();
        return;
      }
      loading.present();
      this.onLocateUser().then(coords => {
         return this.fba.signupUser(
           this.firstname,
          this.surname,
          this.myDate,
          form.value.email,
          form.value.password,
          form.value.group,
          this.phoneNum,
           coords);
      }).then(() => {
        return this.navCtrl.setRoot(ChoicePage, {}, { animate: true, direction: 'forward' }).then(() => {
          loading.dismissAll();
          return this.navCtrl.popToRoot({ animate: true, direction: 'forward' })
        })
        })
    }
    else {
      return this.toastCtrl.create({message: 'Please fill in the missing data.', duration: 4500})
        .present();
    }
  }
}
