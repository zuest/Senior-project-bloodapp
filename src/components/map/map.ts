import {Component, OnInit} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation';
import {LoadingController, ModalController, NavController} from 'ionic-angular';
import {HospitalDetailsPage} from '../../pages/hospital-details/hospital-details';
import {FavoriteProvider} from "../../providers/favorite/favorite";
import {RecipientFillingPage} from "../../pages/recipient-filling/recipient-filling";
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {TwitterProvider} from "../../providers/twitter/twitter";
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/interval';

declare var google: any;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent implements OnInit {
  map: any;

  constructor(public modalCtrl: ModalController, public tweet: TwitterProvider, public navCtrl: NavController, private geolocation: Geolocation,
              public loadingCtrl: LoadingController, public roleProvider: FavoriteProvider, public fbProv: FirebaseProvider) {

  }

  ngOnInit(): void {
    console.log("ionViewWillEnter");
    this.loadMap();
    //let sub = Observable.interval(60000).subscribe((val) => { this.loadMap(); })
  }

  loadMap() {
    let options = {
      enableHighAccuracy: true,
    };
    this.geolocation.getCurrentPosition(options).then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 8,
        mapTypeControlOptions: {
          mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
        }
      };
      var styledMapType = new google.maps.StyledMapType([
        {
          "stylers": [
            {
              "saturation": 100
            },
            {
              "gamma": 0.6
            }
          ]
        }
      ]);
      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      let googlePlaceService = new google.maps.places.PlacesService(this.map);
      this.map.mapTypes.set('styled_map', styledMapType);
      this.map.setMapTypeId('styled_map');
      googlePlaceService.nearbySearch({
        location: latLng,
        radius: 30000,
        keyword: ["Blood|hospital"]
      }, (results, status) => {
        this.fbProv.setResult(results);
        this.callback(results, status)
      });
    }).catch((error) => {
      console.log("Error getting location Code: " + error.code + ", Message: " + error.message);
      console.log("Error", error.stack);
      console.log("Error", error.name);
    });
  }
//im not showing my own requests not here, but in donors map.
  callback(results, status) {
    this.tweet.findCompletedRequests().then((arrayOfCompletedRequests: any[]) => {
      //console.log("Array Length " + arrayOfCompletedRequests.length);
      this.tweet.fetchDataFromTwitter().subscribe((data: any) => {
        let tweets = data.tweets.statuses;
        if (status === google.maps.places.PlacesServiceStatus.OK) { //here i need to check if data read is ok.
          let tweet: any[] = this.tweet.abstractDataFromTwitter(tweets);
          return this.roleProvider.isDonor().then(isDonor => {
            if (isDonor) { // check if this is a donor, if it is we display only the hospitals with requests
              if (arrayOfCompletedRequests.length != 0) {// array not empty
               // console.log("hey im here!!!  "+(arrayOfCompletedRequests.length != 0))
                for (var i = 0; i < results.length; i++) {
                  tweet.forEach((tweetRequests) => {
                    arrayOfCompletedRequests.forEach(elementOfCompletedRequests => {

                      if (tweetRequests.placeOfId  === results[i].place_id.substr(results[i].place_id.length - 4)) { // display only requests with their associated hospital
                        //console.log("GGGG"+JSON.stringify(tweetRequests))
                        var today = new Date();
                        console.log("LOL" + elementOfCompletedRequests)
                        console.log("RFFFF  "+(elementOfCompletedRequests !== tweetRequests.tweetId))
                        console.log("RFFFF  "+(elementOfCompletedRequests +"    "+ tweetRequests.tweetId))
                        //console.log("ELEY "+JSON.stringify(elementOfCompletedRequests !== tweetRequests.tweetId))
                        //console.log("ELEY "+JSON.stringify(elementOfCompletedRequests +"    "+ tweetRequests.tweetId))
                        if ((new Date(tweetRequests.tweetDate) >= new Date(today.toISOString().substring(0, 10))) && (elementOfCompletedRequests !== tweetRequests.tweetId)) { //if tweet is not expired
                          this.createMarker(results[i])
                        }
                      }
                    })
                  })
                }
              }
              else {
                console.log("hey im in else" + results.length )
                for (var i = 0; i < results.length; i++) {
                  // console.log("Js  "+JSON.stringify(tweet))
                  tweet.forEach((tweetRequests) => {
                    //  console.log("   maw   "+(tweetRequests.placeOfId === results[i].place_id))
                    //  console.log("   maw2   "+tweetRequests.placeOfId +"  "+ results[i].place_id)
                     console.log("RFFFF  "+(tweetRequests.placeOfId  === results[i].place_id.substr(results[i].place_id.length - 4)))
                     console.log("RFFFF  "+JSON.stringify(tweetRequests.placeOfId  +"   "+results[i].place_id.substr(results[i].place_id.length - 4)))
                    if (tweetRequests.placeOfId  === results[i].place_id.substr(results[i].place_id.length - 4)) { // display only requests with their associated hospital
                      var today = new Date();
                     // console.log("boi "+(new Date(tweetRequests.tweetDate) >= new Date(today.toISOString().substring(0, 10))))
                     // console.log("boi2 "+(new Date(tweetRequests.tweetDate)  +"   "+ new Date(today.toISOString().substring(0, 10))))
                      if ((new Date(tweetRequests.tweetDate) >= new Date(today.toISOString().substring(0, 10)))) { //if tweet is not expired
                        this.createMarker(results[i])
                      }
                    }
                  })
                }
              }
            }
            else {
              for (var i = 0; i < results.length; i++) {
                this.createMarker(results[i])
              }
            }
          })
        }
      })
    }, e => {
      console.log("Error", e.stack);
      console.log("Error", e.name);
      console.log("Error", e.message);
    });
  }

  public createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location,
      icon: ("assets/images/Hospital_pointer.png")
    });
    marker.setMap(this.map);

    google.maps.event.addListener(marker, 'click', () => {
      this.roleProvider.isDonor().then(result => {
        if (result) {
          let Modal = this.modalCtrl.create(HospitalDetailsPage, {
            param1: place.name,
            param2: place.vicinity,
            param3: place.rating,
            param4: place.geometry.location,
            param5: place.place_id
          });
          return Modal.present();
        }
        else {
          let Modal = this.modalCtrl.create(RecipientFillingPage, {
            param1: place.name,
            param2: place.vicinity,
            param3: place.rating,
            param4: place.geometry.location,
            param5: place.place_id
          });
          return Modal.present();
        }
      })
    });
  }
}
