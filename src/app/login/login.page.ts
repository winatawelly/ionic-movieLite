import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app'
import { AlertController } from '@ionic/angular';
import { UserService } from '../user.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  password: string = "";
  constructor(public afAuth: AngularFireAuth,
              public alert: AlertController,
              public user: UserService,
              public router: Router
              ) { }

  ngOnInit() {
  }

  login(){
    this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password).then((res)=>{
      if(res.user){
        this.user.setUser({
          email:this.email,
          uid:res.user.uid,
          name:res.user.displayName
        })
        this.router.navigate(['/tabs/tab2']);
      }
    }).catch((error)=>{
      //this.showAlert(error.code,error.message);
      return console.log("error.code = "+ error.code + '\nerror.message = ' + error.message);
    })
  }

  

  

}
