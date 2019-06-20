import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

interface movie{
  id : string,
  title : string,
  poster : string
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  mainUser : AngularFirestoreDocument;
  movieList : AngularFirestoreDocument;
  sub;
  profilePic;
  email;
  type:string;
  movies : movie[] = [];
  api:string = "http://www.omdbapi.com/?apikey=96a1da30&i=";
  searchResult;
  constructor(public user : UserService , private router : Router , private afStore : AngularFirestore , public http:Http) {
    
  }

  ionViewWillEnter(){
    if(this.user.isLogin()){
      this.mainUser = this.afStore.doc(`users/${this.user.getUID()}`);
      this.sub = this.mainUser.valueChanges().subscribe(event => {
      this.profilePic = event.profilePic;
      this.email = event.email;
      if(this.profilePic == ''){
        this.profilePic = "95fee9cd-02f6-4e18-8ffa-255ba9273d54";
      }
    })
    this.showMovie();

    }

  }

  signOut(){
    this.user.signOut();
    window.location.reload();
    
  }

  detailMovie(movieID: string){
    this.router.navigate(['tabs/movie/' + movieID + '/' + this.type]);
    
  }

  async showMovie(){
    this.movies = [];
    if(this.type != ''){
      if(this.type == 'ongoing'){
        this.movieList = this.afStore.doc(`${this.user.getUID()}/ongoing`);
        this.sub = this.movieList.valueChanges().subscribe(res => {
          if(Object.keys(res).length != 0){
            for(const mov of res.watchlist){
              this.http.get(this.api+mov).subscribe(result => {
                this.searchResult = result.json();
                this.movies.push({
                  id:mov,
                  title:this.searchResult.Title,
                  poster:this.searchResult.Poster
                })
              })            
            }
          }
          this.sub.unsubscribe();   
        })
        
      }else{
        this.movieList = this.afStore.doc(`${this.user.getUID()}/completed`);
        this.sub = this.movieList.valueChanges().subscribe(res => {
          if(Object.keys(res).length != 0){
            for(const mov of res.watchlist){
              this.http.get(this.api+mov).subscribe(result => {
                this.searchResult = result.json();
                this.movies.push({
                  id:mov,
                  title:this.searchResult.Title,
                  poster:this.searchResult.Poster
                })
              })            
            }
          }
          this.sub.unsubscribe();      
        })
        
      }
    }
  }

  

}
