import { Component } from '@angular/core';
import {SignUpSecondPage} from './sign-up-second'
import {
  NavController,
  Loading,
  LoadingController,
  AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class signup {
  public phone_number:number;
  public signupForm: FormGroup;

  value:any;

  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public toastCtrl    : ToastController,
              public loading: LoadingController,
              public alertCtrl: AlertController) {
    // /^[0-9]{10}$/
    this.signupForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.required,Validators.pattern("[a-zA-Z]*")])],
      surname: ['', Validators.compose([Validators.required,Validators.pattern("[a-zA-Z]*")])],
      myDate: ['', Validators.compose([Validators.required])],
    });
  }

  pressNext(form: FormGroup){
    if (form.valid && typeof(this.phone_number) != "undefined") {
      let loading = this.loading.create({content : "loading ,please wait..."});
      loading.present();
      this.navCtrl.push(SignUpSecondPage, {
        firstName: this.signupForm.value.firstName,
        surname: this.signupForm.value.surname,
        myDate: this.signupForm.value.myDate,
        phoneNum:this.phone_number
      }).then(()=>{
        loading.dismissAll();
      });
    } else {
      this.toastCtrl.create({message: 'Please fill in the missing data.', duration: 4500})
        .present();
    }
  }


}
