import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database-deprecated";
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserDetailsComponent implements OnInit {

  @ViewChild('avatarDiv') private avatarDiv: ElementRef;

  user: Observable<firebase.User>;
  displayName: string;
  status: string;
  onlineUsers: number = 0;
  offlineUsers: number = 0;
  busyUsers: number = 0;

  constructor(private authService: AuthService, private db: AngularFireDatabase, private router: Router) { }

  ngOnInit() {
    this.user = this.authService.authUser();
    this.user.subscribe(user => {
      if(user) {
        const path = `/users/${user.uid}`;
        this.getUser(path).subscribe(a => {
          this.displayName = a.displayName;
          this.status = a.status;
          if (a.url !== 'null') {
            this.avatarDiv.nativeElement.style.backgroundImage = `url(${a.url})`;
          } else {
            this.avatarDiv.nativeElement.style.backgroundImage = `url(assets/userIcon.png)`;
          }
        });
        this.getUsers(`/users`).subscribe(a => {
          this.resetIndicators();
          a.forEach(element => {
            if(!this.isAuthenticated(element)) {
              if(element.status === 'online') {
                this.onlineUsers++;
              } else if(element.status === 'offline') {
                this.offlineUsers++;
              } else if(element.status === 'busy') {
                this.busyUsers++;
              }
            }
          });
        });
      }
    });
  }

  isAuthenticated(user) {
    if (user.$key === this.authService.currentUserID) {
      return true;
    } else {
      return false;
    }
  }

  edit() {
    this.router.navigate(['edit']);
  }

  resetIndicators() {
    this.onlineUsers = 0;
    this.offlineUsers = 0;
    this.busyUsers = 0;
  }

  logout() {
    this.authService.logout();
  }

  setStatus(status: string) {
    this.user = this.authService.authUser();
    this.user.subscribe(user => {
      if(user) {
        const path = `/users/${user.uid}`;
        const data = {
          status: status
        };
    
        this.db.object(path).update(data)
        .catch(error => console.log(error));
      }
    });
  }

  getUser(path: string) {
    return this.db.object(path);
  }

  getUsers(path: string) {
    return this.db.list(path);
  }

}
