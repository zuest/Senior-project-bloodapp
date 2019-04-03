import {Component} from '@angular/core';
import {
  Loading,
  LoadingController,
  NavController,
  AlertController, ModalController
} from 'ionic-angular';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {EmailValidator} from '../../validators/email';
import {FirebaseProvider} from '../../providers/firebase/firebase';
import {HomePage} from '../home/home';
import {signup} from '../../pages/signup/signup'
import {FavoriteProvider} from "../../providers/favorite/favorite";
import {RecipientFillingPage} from "../recipient-filling/recipient-filling";
import {ChoicePage} from "../choice/choice";
import {ForgetPasswordPage} from "../forget-password/forget-password";
import {MenuPage} from "../menu/menu";
import {CustomAlertModalPage} from "../custom-alert-modal/custom-alert-modal";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class login {

  public loginForm: FormGroup;
  public loader: Loading;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              private typeProvider: FavoriteProvider,
              public authProvider: FirebaseProvider, public formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required,
        EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6),
        Validators.required])]
    });
  }

  goToSignup(): void {
    let loading = this.loadingCtrl.create({content : "Logging in ,please wait..."});
    loading.present();
    this.navCtrl.push(signup).then(()=>{
      loading.dismissAll();
    });
  }

  goToResetPassword(): void {
    let loading = this.loadingCtrl.create({content : "Logging in ,please wait..."});
    loading.present();
     this.navCtrl.push(ForgetPasswordPage).then(()=>{
       loading.dismissAll();
     });
  }

  loginUser(): void {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.authProvider.loginUser(this.loginForm.value.email,
        this.loginForm.value.password)
        .then(authData => {
          this.loader.dismiss().then(() => {

            this.typeProvider.isDonor().then((resultOne) => {
              return this.typeProvider.isRecipient().then(secondResult => {
                if (resultOne) {
                  console.log("already choosen donor or recipient", resultOne, secondResult)
                  this.navCtrl.setRoot(MenuPage);
                }
                else if (secondResult) {
                  this.navCtrl.setRoot(RecipientFillingPage);
                }
                else {
                  this.navCtrl.setRoot(ChoicePage);
                }
              })
            })
          });
        }, error => {
          this.loader.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });
      this.loader = this.loadingCtrl.create();
      this.loader.present();
    }
  }
}
