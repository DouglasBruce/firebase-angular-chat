import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database-deprecated";
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {

  private user: Observable<firebase.User>;
  errorMsg: string;
  
  get currentUserID(): string {
    return this.afAuth.auth.currentUser.uid;
  }

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) { 
    this.user = afAuth.authState;
  }

  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.setUserStatus('online');
        this.router.navigate(['chat']);
      }).catch(error => console.log(error.message));
  }

  signUp(email: string, password: string, displayName: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then((user) => {
      this.setUserData(email, displayName, 'online', 2);
      var firebaseUser = firebase.auth().currentUser;
      firebaseUser.updateProfile({
        displayName: displayName,
        photoURL: 'null'
      });
    }).catch(error => console.log(error.message));
  }

  setUserData(email: string, displayName: string, status: string, userType: number) {
    const path = `users/${this.currentUserID}`;
    const data = {
      email: email,
      displayName: displayName,
      status: status,
      userType: userType,
      url: 'null'
    };

    this.db.object(path).update(data)
    .catch(error => console.log(error.message));
  }

  setUserStatus(status: string) {
    const path = `users/${this.currentUserID}`;
    const data = {
      status: status
    };

    this.db.object(path).update(data)
    .catch(error => console.log(error.message));
  }

  logout() {
    this.setUserStatus('offline');
    this.afAuth.auth.signOut();
    this.router.navigate(['login']);
  }

  authUser() {
    return this.user;
  }  

}
