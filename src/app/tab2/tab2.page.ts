import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';
import { async } from '@angular/core/testing';
import { NgForOf } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  mainUser : AngularFirestoreDocument;
  searchResult:string;
  isExist:boolean = true;
  api:string = "http://www.omdbapi.com/?apikey=96a1da30&s=";
  sub;
  constructor(public http : Http, public afStore : AngularFirestore,private user : UserService, public alert : AlertController, public router : Router) 
  {
    this.mainUser = afStore.doc(`users/${this.user.getUID()}`);
  }

  searchMovie(event){
    const searchMovieTitle = this.api+event.target.value.split(' ').join('+');
    this.http.get(searchMovieTitle).subscribe(res =>{
      this.searchResult = res.json();

      console.log(this.searchResult);
    })
    
  }

  addToWatchlist(movieName:string){
    const searchMovieTitle = this.api+movieName.split(' ').join('+');
    //this.checkDouble(searchMovieTitle);
    if(this.isExist){
      this.afStore.doc(`${this.user.getUID()}/ongoing`).update({
        watchlist: firestore.FieldValue.arrayUnion(searchMovieTitle)
      })
  
      this.showAlert("Success", movieName+' added to your watchlist !');
      this.isExist = false;
    }else{
      this.showAlert("Failed", movieName+' is already in your watchlist !')
      this.isExist = false;
    }
    
    
  }

  checkDouble(movieName:string){
    
    this.sub = this.mainUser.valueChanges().subscribe(event => {
      event.watchlist.forEach(movie =>{
        if(movie == movieName){
          this.isExist = true;
        }
      })
    })
    this.sub.unsubscribe();
    return this.isExist;
  }

  async showAlert(header:string, message:string){
    const alert = await this.alert.create({
      header,
      message,
      buttons:['ok']
    })
    await alert.present();
  }

  detailMovie(movieName: string){
    this.router.navigate(['/movie']);
    
  }

}
