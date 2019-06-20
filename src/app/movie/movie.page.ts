import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  from; 
  ongoingMovieList : AngularFirestoreDocument;
  completedMovieList : AngularFirestoreDocument;
  api:string = "http://www.omdbapi.com/?apikey=96a1da30&i=";
  constructor(public route:ActivatedRoute , public http:Http , public afStore : AngularFirestore , private user : UserService , public alert : AlertController , public router:Router) { }

  ngOnInit() {
    if(this.user.isLogin()){
      this.ongoingMovieList = this.afStore.doc(`${this.user.getUID()}/ongoing`);
      this.completedMovieList = this.afStore.doc(`${this.user.getUID()}/completed`);
      console.log(this.user.getEmail());
    }

    this.movieID = this.route.snapshot.paramMap.get('id');
    this.from = this.route.snapshot.paramMap.get('from');
    if(this.from){
      console.log(this.from);
    }
    const searchMovie = this.api+this.movieID;
    this.http.get(searchMovie).subscribe(res => {
      this.searchResult = res.json();
      console.log(this.searchResult);
    })
  }

  ionViewWillEnter(){
   
  }


  checkDouble(id:string){
    if(!this.user.isLogin()){
      return this.showAlert("Error","You need to login first!")
    }
    this.isExist = false;
    this.sub1 = this.ongoingMovieList.valueChanges().subscribe(res => {
      if(Object.keys(res).length != 0){
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
      }else{
        this.sub1.unsubscribe();
        this.checkDouble2(id);
      }
      
      
      
    });   
  }

  checkDouble2(id:string){
    this.sub2 = this.completedMovieList.valueChanges().subscribe(res2 => {
      if(Object.keys(res2).length != 0){
        for(const mov2 of res2.watchlist){
          if(id == mov2){
            console.log("hei");
            this.isExist = true;
          }
        }
        if(!this.isExist){
          console.log("dari check2");
          this.sub2.unsubscribe();
          this.addToWatchlist(id);
        }
        else{
          this.showAlert("Failed", "This movie is already on your completed watchlist")
        }
      }else{
        this.sub2.unsubscribe();
        this.addToWatchlist(id);
      }

      

      
    })
    
  }

  addToWatchlist(id:string){
      this.afStore.doc(`${this.user.getUID()}/ongoing`).update({
        watchlist:firestore.FieldValue.arrayUnion(id)
      })
      this.showAlert("success","added to watchlist!");
  }

  complete(id:string){
    this.afStore.doc(`${this.user.getUID()}/ongoing`).update({
      watchlist:firestore.FieldValue.arrayRemove(id)
    });
    this.afStore.doc(`${this.user.getUID()}/completed`).update({
      watchlist:firestore.FieldValue.arrayUnion(id)
    })
    this.showAlert("Success","Moved to completed list!");
    this.router.navigate(['/tabs/tab3']);
  }

  delete(id:string){
    this.afStore.doc(`${this.user.getUID()}/${this.from}`).update({
      watchlist:firestore.FieldValue.arrayRemove(id)
    })
    this.showAlert("Success","Deleted!");
    this.router.navigate(['/tabs/tab3']);
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
