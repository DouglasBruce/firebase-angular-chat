import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from '../models/user.model';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {

  users: User[];

  constructor(chat: ChatService, private authService: AuthService) {
    chat.getUsers().subscribe(users => {
      this.users = users.filter(user => !this.isAuthenticated(user));
    });
  }

  isAuthenticated(user) {
    if (user.$key === this.authService.currentUserID) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() {
  }

}
