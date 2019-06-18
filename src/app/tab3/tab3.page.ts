import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  mainUser : AngularFirestoreDocument;
  sub;
  profilePic;
  email;
  constructor(private user : UserService , private router : Router , private afStore : AngularFirestore) {
    if(user.isLogin()){
      this.mainUser = this.afStore.doc(`users/${user.getUID()}`);
      this.sub = this.mainUser.valueChanges().subscribe(event => {
      this.profilePic = event.profilePic;
      this.email = event.email;
      if(this.profilePic == ''){
        this.profilePic = "95fee9cd-02f6-4e18-8ffa-255ba9273d54";
      }
    })

    }
    
    
  }

  signOut(){
    this.user.signOut();
  }

}
