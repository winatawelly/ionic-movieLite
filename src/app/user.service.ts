import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';
import { auth } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

interface user{
    email : string,
    uid : string,
}
@Injectable()
export class UserService{
    private user: user;
    login : boolean = false;

    constructor(private afAuth:AngularFireAuth , private afStore : AngularFirestore){

    }

    setUser(user:user){
        this.user = user;
        this.login = true;
    }

    getUID(){
       
        return this.user.uid;
        
        
    }

    getEmail() {
        return this.user.email;
    }

    isLogin(){
        return this.login;
    }



    reAuth(email:string , password:string){
        return this.afAuth.auth.currentUser.reauthenticateWithCredential(auth.EmailAuthProvider.credential(email,password));
    }

    signOut(){
        return this.afAuth.auth.signOut();
    }

    async isAuthenticated(){
        if(this.user) return true;
        const user = await this.afAuth.authState.pipe(first()).toPromise();
        console.log(user);
        if(this.isLogin){
            if(user){
                this.setUser({
                    email: user.email,
                    uid: user.uid
                })

                //return true;
            }
        }
       
        return true;
    }
    
}