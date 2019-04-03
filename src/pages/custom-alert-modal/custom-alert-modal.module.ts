import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomAlertModalPage } from './custom-alert-modal';

@NgModule({
  declarations: [
    CustomAlertModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomAlertModalPage),
  ],
})
export class CustomAlertModalPageModule {}
