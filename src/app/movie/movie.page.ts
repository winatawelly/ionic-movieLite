import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-movie',
  templateUrl: './movie.page.html',
  styleUrls: ['./movie.page.scss'],
})
export class MoviePage implements OnInit {
  movieID : string;
  searchResult;
  isExist : boolean = false;
  isExist2 : boolean = false;
  sub1;
  sub2; 
  ongoingMovieList : AngularFirestoreDocument;
  completedMovieList : AngularFirestoreDocument;
  api:string = "http://www.omdbapi.com/?apikey=96a1da30&i=";
  constructor(public route:ActivatedRoute , public http:Http , public afStore : AngularFirestore , private user : UserService , public alert : AlertController) { }

  ngOnInit() {
    this.ongoingMovieList = this.afStore.doc(`${this.user.getUID()}/ongoing`);
    this.completedMovieList = this.afStore.doc(`${this.user.getUID()}/completed`);
    this.movieID = this.route.snapshot.paramMap.get('id');
    const searchMovie = this.api+this.movieID;
    this.http.get(searchMovie).subscribe(res => {
      this.searchResult = res.json();
      console.log(this.searchResult);
    })
    console.log(this.user.getEmail());
  }

  checkDouble(id:string){
    this.isExist = false;
    this.sub1 = this.ongoingMovieList.valueChanges().subscribe(res => {
      for(const mov of res.watchlist){
        if(id == mov){
         this.isExist = true;
        }
      }
      if(!this.isExist){
        this.sub1.unsubscribe();
        this.checkDouble2(id);
      }else{
        this.showAlert("Failed", "This movie is already on your ongoing watchlist")
      }
      
    });   
  }

  checkDouble2(id:string){
    this.sub2 = this.completedMovieList.valueChanges().subscribe(res2 => {
      for(const mov2 of res2.watchlist){
        if(id == mov2){
          console.log("hei");
          this.isExist = true;
        }
      }
      if(!this.isExist){
        console.log("dari check2");
        this.addToWatchlist(id);
      }
      else{
        this.showAlert("Failed", "This movie is already on your completed watchlist")
      }

      
    })
    
  }

  

  addToWatchlist(id:string){
      this.afStore.doc(`${this.user.getUID()}/ongoing`).update({
        watchlist:firestore.FieldValue.arrayUnion(id)
      })
      this.showAlert("success","added to watchlist!");
  }

  async showAlert(header:string, message:string){
    const alert = await this.alert.create({
      header,
      message,
      buttons:['ok']
    })
    await alert.present();
  }

}
