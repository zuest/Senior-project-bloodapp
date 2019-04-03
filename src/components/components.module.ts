import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { PickupComponent } from './pickup/pickup';
import { HospitalMarkerComponent } from './hospital-marker/hospital-marker';
@NgModule({
	declarations: [MapComponent,
    PickupComponent,
    HospitalMarkerComponent],
	imports: [],
	exports: [
	  MapComponent,
    PickupComponent,
    HospitalMarkerComponent]
})
export class ComponentsModule {}
