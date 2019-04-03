import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompleteDonationPage } from './complete-donation';

@NgModule({
  declarations: [
    CompleteDonationPage,
  ],
  imports: [
    IonicPageModule.forChild(CompleteDonationPage),
  ],
})
export class CompleteDonationPageModule {}
