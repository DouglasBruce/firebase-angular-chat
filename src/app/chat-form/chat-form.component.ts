import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatService } from "../services/chat.service";

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatFormComponent implements OnInit {

  message: string;

  constructor(private chat: ChatService) { }

  ngOnInit() {
    this.message = null;
  }

  send() {
    if (this.message !== null && this.message !== '') {
      this.chat.sendMessage(this.message);
      this.message = null;
    }
  }

  handleSubmit(event) {
    if(event.keyCode === 13) {
      event.preventDefault();
      this.send();
    }
  }

}
