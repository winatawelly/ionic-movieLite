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
    if(user.isLogin()){
      this.mainUser = afStore.doc(`users/${this.user.getUID()}`);
    }

  }

  searchMovie(event){
    const searchMovieTitle = this.api+event.target.value.split(' ').join('+');
    this.http.get(searchMovieTitle).subscribe(res =>{
      this.searchResult = res.json();

      console.log(this.searchResult);
    })
    
  }
  
  async showAlert(header:string, message:string){
    const alert = await this.alert.create({
      header,
      message,
      buttons:['ok']
    })
    await alert.present();
  }

  detailMovie(movieID: string){
    this.router.navigate(['tabs/movie/' + movieID]);
    
  }

}
