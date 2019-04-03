import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import {observable} from "rxjs/symbol/observable";
/*
  Generated class for the TwitterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TwitterProvider {
  private posts: any;
  private httpReader: Observable<any>;


  constructor(public http: HttpClient) {
    console.log('Hello TwitterProvider Proveider');
  }



  public abstractDataFromTwitter(tweets):any{
  let usersFromTwitter:any[]  = [];
    tweets.forEach(tweet => {
      let indexStart;
      let indexEnd;
      let indexStartForToken;
      let indexEndForToken;
      indexStart = tweet.full_text.indexOf('place Id "');
      indexEnd = tweet.full_text.indexOf('";');
      indexStartForToken = tweet.full_text.indexOf('user id:"');
      indexEndForToken = tweet.full_text.indexOf('"*');
      usersFromTwitter.push({
        screenName:tweet.user.screen_name,
        placeOfId: tweet.full_text.slice(indexStart + 10, indexEnd),
        userId: tweet.full_text.slice(indexStartForToken+9,indexEndForToken),
        tweetDate:tweet.full_text.slice(tweet.full_text.indexOf('Expires at: ')+12, tweet.full_text.indexOf(' -')),
        tweetId:tweet.id_str
      })
    });
    return usersFromTwitter;
  }

  completeDonation(LocationInformation: any) {
    let apiUrl = 'https://us-central1-blood-don.cloudfunctions.net/postTweet';
    return new Promise((resolve, reject) => {
      let tweetRespond = {};
      this.http.post(apiUrl, tweetRespond)
        .subscribe(res => {
          resolve(res);
        }, (e) => {
          console.log("Erro", e.stack);
          console.log("Error", e.name);
          console.log("Error", e.message);
          reject(e);
        });
    });
  }

  fetchDataFromTwitter(){
    return this.httpReader = this.http.get('https://us-central1-blood-don.cloudfunctions.net/api/').map((resp) => resp).catch((e: any) => {
      console.log("Error", e.stack);
      console.log("Error", e.name);
      console.log("Error", e.message);
      return Observable.of(undefined);
    });
  }



fetchRepliesFromTwitter(): any {
    return this.http.get('https://us-central1-blood-don.cloudfunctions.net/getReplysForTweetById/').map((resp) => resp).catch((err:any) =>{
      return Observable.of(undefined);
    });
  }

  fetchCompletedTweets(): any {
    return this.http.get('https://us-central1-blood-don.cloudfunctions.net/getCompletionTweets/').map((resp) => resp).catch((err:any) =>{
      return Observable.of(undefined);
    });
  }

  //   this.fetchRepliesFromTwitter().subscribe(
//     assettypes => {
//   //do something
// },
// err => {
//   this._LogService.error(JSON.stringify(err))
// },
//   () => {}
// );

  findCompletedRequests(){

    let promise1=this.fetchDataFromTwitter().toPromise();
    let promise2=this.fetchRepliesFromTwitter().toPromise();
    let promise3= this.fetchCompletedTweets().toPromise();
  let completedRequests: any[] = [];

    return promise1.then((requests: any) => {
     return  promise2.then((Replies: any) => {
       return  promise3.then((completedTweets: any) => {
        completedTweets.tweets.statuses.forEach(dataOne => {
          Replies.tweets.statuses.forEach(dataTwo => {
            if(dataTwo.id_str === dataOne.in_reply_to_status_id_str) {
              requests.tweets.statuses.forEach(dataThree => {
                if (dataTwo.in_reply_to_status_id_str === dataThree.id_str ) {
                  console.log("i thought it worked? "+dataThree.id_str)
                  completedRequests.push(dataThree.id_str)
                  }
                })
              }
            })
          });
        });
      })
    }).then(() =>{
      return new Promise((resolve, reject) => {
        // do something asynchronous which eventually calls either:
        //
        console.log("im in resolve"+JSON.stringify(completedRequests))
        resolve(completedRequests); // fulfilled
        // or
        reject("failure reason"); // rejected
      });
    })
  }
}


