import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'; 
import { AngularFireDatabase } from "angularfire2/database-deprecated";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthenticationGuardService {

  user: Observable<firebase.User>;
  userType: number;
  
    constructor(private afAuth: AngularFireAuth, private router: Router, private db: AngularFireDatabase) {
      this.user = afAuth.authState;
    }
  
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.user.map((auth) => {
        if (!auth) {
          this.router.navigateByUrl('/login');
          return false;
        } 
        return true;
      }).take(1);
    }

    getUser(path: string) {
      return this.db.object(path);
    }

}
