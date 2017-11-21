import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserItemComponent implements OnInit {

  @Input() user: User;
  @ViewChild('avatarSmallDiv') private avatarSmallDiv: ElementRef;

  constructor() { }

  ngOnInit() {
    if (this.user.url !== 'null') {
      this.avatarSmallDiv.nativeElement.style.backgroundImage = `url(${this.user.url})`;
    } else {
      this.avatarSmallDiv.nativeElement.style.backgroundImage = `url(assets/userIcon.png)`;
    }
  }

}
