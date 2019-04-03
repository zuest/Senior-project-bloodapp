import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuForRecipientPage } from './menu-for-recipient';

@NgModule({
  declarations: [
    MenuForRecipientPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuForRecipientPage),
  ],
})
export class MenuForRecipientPageModule {}
