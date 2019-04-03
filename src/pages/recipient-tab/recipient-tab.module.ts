import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecipientTabPage } from './recipient-tab';

@NgModule({
  declarations: [
    RecipientTabPage,
  ],
  imports: [
    IonicPageModule.forChild(RecipientTabPage),
  ],
})
export class RecipientTabPageModule {}
