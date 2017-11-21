import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { ChatMessage } from '../models/chat-message.model';
import * as firebase from 'firebase/app';

@Injectable()
export class ChatService {

  user: firebase.User;
  chatMessages: FirebaseListObservable<ChatMessage[]>;
  chatMessage: ChatMessage;
  displayName: Observable<string>;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }

      this.getUser().subscribe(a => {
        this.displayName = a.displayName;
      });
    });
  }

  getUser() {
    const user = this.user.uid;
    const path = `/users/${user}`;
    return this.db.object(path);
  }

  getUsers() {
    const path = `/users`;
    return this.db.list(path);
  }

  getTimeStamp() {
    const now = new Date();
    const date = now.getUTCFullYear() + '/' + (now.getUTCMonth() + 1) + '/' + now.getUTCDate();
    const time = now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds();

    return (date + ' ' + time);
  }

  getMessages(): FirebaseListObservable<ChatMessage[]> {
    return this.db.list('messages', {
      query: {
        limitToLast: 25,
        orderByKey: true
      }
    });
  }

  sendMessage(msg: string) {
    const timestamp = this.getTimeStamp();
    const email = this.user.email;
    this.chatMessages = this.getMessages();
    this.chatMessages.push({
      uid: this.user.uid,
      message: msg,
      timeStamp: timestamp,
      displayName: this.displayName,
      email: email    
    });
  }

}
