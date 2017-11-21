import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { ChatMessage } from '../models/chat-message.model';
import { AngularFireDatabase } from "angularfire2/database-deprecated";
import { ChatroomComponent } from '../chatroom/chatroom.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MessageComponent implements OnInit, OnChanges {

  @Input() chatMessage: ChatMessage;
  @ViewChild('messageIconDiv') private messageIconDiv: ElementRef;

  userEmail: string;
  userId: string;
  displayName: string;
  messageContent: string;
  isOwnMessage: boolean;
  ownEmail: string;

  ngOnChanges(){
    this.chatroom.scrollToBottom();
  }

  constructor(private authService: AuthService, private db: AngularFireDatabase, private chatroom: ChatroomComponent) {
    authService.authUser().subscribe(user => {
      if (user) {
        this.ownEmail = user.email;
        this.isOwnMessage = this.ownEmail === this.userEmail;
        const path = `/users/${this.userId}`;
        this.getUser(path).subscribe(a => {
          if (a.url !== 'null') {
            this.messageIconDiv.nativeElement.style.backgroundImage = `url(${a.url})`;
          } else {
            this.messageIconDiv.nativeElement.style.backgroundImage = `url(assets/userIcon.png)`;
          }
        });
      }
    });
  }

  getUser(path: string) {
    return this.db.object(path);
  }

  ngOnInit(chatMessage = this.chatMessage) {
    this.userId = chatMessage.uid;
    this.userEmail = chatMessage.email;
    this.displayName = chatMessage.displayName;
    this.messageContent = chatMessage.message;
  }

}
