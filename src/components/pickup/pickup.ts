import { Component,Input } from '@angular/core';
declare var google: any;

/**
 * Generated class for the PickupComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pickup',
  templateUrl: 'pickup.html'
})
export class PickupComponent{
  @Input() isPinSet:boolean;
  @Input() map:any;
  private pickupMarker: any;
  private popup:any;
  constructor() {
    console.log('Hello PickupComponent Component');
  }

  ngOnChanges(changes){
    if (this.isPinSet){
      this.showPickupMarker();
    }
    else{
      this.removePickupMarker();
    }
  }
  showPickupMarker(){
    this.pickupMarker = new google.maps.Marker(
      {
        map: this.map,
        animation:google.maps.Animation.BOUNCE,
        position:this.map.getCenter(),
        icon:("assets/images/location_filled.svg")
      })
    setTimeout(()=> {
      this.pickupMarker.setAnimation(null);
    },750)
    this.showPickupTime();
  }

  removePickupMarker(){
    if(this.pickupMarker){
      this.pickupMarker.setMap(null);
    }
  }
//testing
  showPickupTime(){
    this.popup = new google.maps.InfoWindow({
      content:'<h5>you are here</h5>'
    })
    this.popup.open(this.map,this.pickupMarker);
    google.maps.event.addListener(this.pickupMarker,'click', () => {
      this.popup.open(this.map,this.pickupMarker);
    })
  }
}
