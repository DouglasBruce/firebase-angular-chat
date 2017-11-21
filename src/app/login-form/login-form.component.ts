import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginFormComponent implements OnInit {

  @ViewChild('passwordInput') private passwordInput: ElementRef;

  email: string;
  resetEmail: string;
  password: string;
  errorMsg: string;
  success: boolean = false;
  hasForgotPassword: boolean = false;
  passwordVisibility: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  closeAlert(index: number) {
    if(index == 1) {
      this.success = null;
    }
  }

  signIn(){
    this.authService.login(this.email, this.password)
    .catch(error => this.errorMsg = error.message);
  }

  showPassword() {
    if(this.passwordInput.nativeElement.type === 'password') {
      this.passwordInput.nativeElement.type = 'text';
      this.passwordVisibility = true;
    } else {
      this.passwordInput.nativeElement.type = 'password';
      this.passwordVisibility = false;
    }
  }

  forgotPassword() {
    this.hasForgotPassword = true;
  }

  reset() {
    var auth = firebase.auth();
    auth.sendPasswordResetEmail(this.resetEmail).then(resolve => {
      this.hasForgotPassword = false;
      this.success = true;
      this.resetEmail = null;
    }).catch(error => this.errorMsg = error.message);
  }
  
  signUp(){
    this.router.navigate(['signup']);
  }

  ngOnInit() {
  }

}
