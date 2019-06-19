import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email : string = '';
  password : string = '';
  cPassword : string = '';
  name : string = '';

  constructor(public afAuth: AngularFireAuth,
    public afStore: AngularFirestore,
    public alert: AlertController,
    public router: Router,
    public user: UserService,
    ) { }

  ngOnInit() {
  }

  register(){
    if(this.email == "" || this.password == '' || this.cPassword == '' || this.name == ''){
      return this.showAlert("Error","")
    }
    if(this.password != this.cPassword){
      return this.showAlert("Error","Passwords do not match!");
    }
    this.afAuth.auth.createUserWithEmailAndPassword(this.email,this.password).then((success)=>{
      this.afAuth.auth.currentUser.updateProfile({
        displayName:this.name
      })
      this.afStore.doc(`users/${success.user.uid}`).set({
        email:this.email,
        profilePic:'',
        displayName:this.name
      })

      this.afStore.doc(`${success.user.uid}/ongoing`).set({});
      this.afStore.doc(`${success.user.uid}/completed`).set({});
      
      this.user.setUser({
        email:this.email,
        uid:success.user.uid,
        name:success.user.displayName
      })

      this.showAlert("Success","Welcome!");
      this.router.navigate(['/tabs']);
    }).catch((error)=>{
      return this.showAlert(error.code , error.message);
      });
    
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
