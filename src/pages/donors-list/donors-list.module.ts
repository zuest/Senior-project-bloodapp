import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DonorsListPage } from './donors-list';

@NgModule({
  declarations: [
    DonorsListPage,
  ],
  imports: [
    IonicPageModule.forChild(DonorsListPage),
  ],
})
export class DonorsListPageModule {}
