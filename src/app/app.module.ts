import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {login} from '../pages/login/login'
import {signup} from '../pages/signup/signup'
import {IonicStorageModule} from '@ionic/storage';
import {SignUpSecondPage} from '../pages/signup/sign-up-second'
import {MultiPickerModule} from 'ion-multi-picker';
import {Geolocation} from '@ionic-native/geolocation';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';
import {Intro} from '../pages/intro/intro';
import {ChoicePage} from '../pages/choice/choice';
import {MapComponent} from '../components/map/map';
import {PickupComponent} from '../components/pickup/pickup'
import {HospitalDetailsPage} from '../pages/hospital-details/hospital-details'
import {FavoriteProvider} from '../providers/favorite/favorite';
import {RecipientFillingPage} from "../pages/recipient-filling/recipient-filling";
import {TabsPage} from "../pages/tabs/tabs";
import {RecipientListPage} from "../pages/recipient-list/recipient-list";
import {FirebaseProvider} from '../providers/firebase/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import {firebaseConfig} from '../environment';
import {AngularFireAuthModule} from "angularfire2/auth";
import { FCM } from '@ionic-native/fcm';
import {CompleteDonationPage} from "../pages/complete-donation/complete-donation";
import {NgxQRCodeModule} from "ngx-qrcode2";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {MenuPage} from "../pages/menu/menu";
import {ForgetPasswordPage} from "../pages/forget-password/forget-password";
import {HttpClientModule} from "@angular/common/http";
import { TwitterProvider } from '../providers/twitter/twitter';
import {TweetsPage} from "../pages/tweets/tweets";
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { DataShareProvider } from '../providers/data-share/data-share';
import { EncrptionProvider } from '../providers/encrption/encrption';
import { CompressionProvider } from '../providers/compression/compression';
import { LZStringModule, LZStringService } from 'ng-lz-string';
import { UtilitiesProvider } from '../providers/utilities/utilities';
import {DonorsListPage} from "../pages/donors-list/donors-list";
import {CallNumber} from '@ionic-native/call-number';
import {RecipientTabPage} from "../pages/recipient-tab/recipient-tab";
import {BloodTypePipe} from "../pipes/blood-type/blood-type";
import { SocialSharing } from '@ionic-native/social-sharing';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import {CustomAlertModalPage} from "../pages/custom-alert-modal/custom-alert-modal";
import {MenuForRecipientPage} from "../pages/menu-for-recipient/menu-for-recipient";

let appPages = [
  MyApp,
  login,
  TabsPage,
  HomePage,
  signup,
  SignUpSecondPage,
  Intro,
  ChoicePage,
  HospitalDetailsPage,
  RecipientFillingPage,
  TabsPage,
  RecipientListPage,
  CompleteDonationPage,
  MenuPage,
  ForgetPasswordPage,
  TweetsPage,
  DonorsListPage,
  RecipientTabPage,
  CustomAlertModalPage,
  MenuForRecipientPage
];

@NgModule({
  declarations: [
    appPages,
    MapComponent,
    PickupComponent,
    BloodTypePipe
  ],
  imports: [
    NgxIntlTelInputModule,
    MultiPickerModule,
    BrowserModule,
    AngularFirestoreModule,
    IonicStorageModule.forRoot(),
    BsDropdownModule.forRoot(),
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    NgxQRCodeModule,
    AngularFireAuthModule,
    HttpClientModule,
    LZStringModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    appPages,
    MapComponent,
    PickupComponent
  ],
  providers: [
    BarcodeScanner,
    StatusBar,
    SplashScreen,
    Geolocation,
    LZStringService,
    FCM,
    NativeGeocoder,
    CallNumber,
    LaunchNavigator,
    SocialSharing,
    {
      provide: ErrorHandler, useClass: IonicErrorHandler
    },
    FirebaseProvider,
    FavoriteProvider,
    TwitterProvider,
    DataShareProvider,

    EncrptionProvider,
    CompressionProvider,
    UtilitiesProvider
  ]
})
export class AppModule {
}
