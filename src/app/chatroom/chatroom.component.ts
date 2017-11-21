import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatroomComponent implements OnInit {

  @ViewChild('feedWrapper') private feedWrapper: ElementRef;

  constructor() { }

  ngOnInit() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.feedWrapper.nativeElement.scrollTop = this.feedWrapper.nativeElement.scrollHeight;
  }

}
