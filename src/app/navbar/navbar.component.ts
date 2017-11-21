import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from "angularfire2/database-deprecated";
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	title: string;
	user: Observable<firebase.User>;

	constructor(private authService: AuthService, private router: Router, private db: AngularFireDatabase) { }

	ngOnInit() {
		this.title = "Firebase Chat";
		this.user = this.authService.authUser();
	}

	logOut(){
		this.authService.logout();
	}

}
