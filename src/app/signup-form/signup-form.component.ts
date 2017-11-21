import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from "angularfire2/database-deprecated";
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignupFormComponent implements OnInit {

  @ViewChild('passwordInput') private passwordInput: ElementRef;
  @ViewChild('fileInput') private fileInput: ElementRef;
  @ViewChild('imgDiv') private imgDiv: ElementRef;

  email: string;
  password: string;
  displayName: string;
  errorMsg: string;
  url: string;
  passwordVisibility: boolean = false;
  accountCreated: boolean = false;
  showSpinner = false;
  selectedProfilePic: FileList;
  profileLoaded: boolean;
  private profilePath:string = '/profile';
  private userPath:string = '/users';

  constructor(private authService: AuthService, private db: AngularFireDatabase, private router: Router) { }

  login() {
    this.router.navigate(['login']);
  }

  signUp() {
    const email = this.email;
    const password = this.password;
    const displayName = this.displayName;
    this.authService.signUp(email, password, displayName).then(resolve => {
      this.accountCreated = true;
    })
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

  skip() {
    if (this.selectedProfilePic) {
      this.deleteFileStorage(this.authService.currentUserID);
    }
    this.router.navigate(['chat']);
  }

  continue() {
    this.saveFileUrl(this.url, this.authService.currentUserID);
    this.router.navigate(['chat']);
  }

  selectProfilePic() {
    this.fileInput.nativeElement.click();
  }

  detectFiles(event) {
    this.selectedProfilePic = event.target.files;
    let file = this.selectedProfilePic.item(0);
    this.showSpinner = true;
    this.imageUpload(file, this.authService.currentUserID);
  }

  imageUpload(file: File, userId: string) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.profilePath}/${userId}`).put(file);
    
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
      },
      (error) => {
        // upload failed
        this.errorMsg = error.message;
      },
      () => {
        // upload success
        this.url = uploadTask.snapshot.downloadURL;
        this.setProfilePicUrl();
        return undefined
      }
    );
  }

  // Writes the file details to the realtime db
  private saveFileUrl(url: string, userId: string) {
    const path = `${this.userPath}/${userId}`;
    const data = {
      url: url
    };

    this.db.object(path).update(data)
    .catch(error => this.errorMsg = error.message);
  }

  setProfilePicUrl() {
    this.imgDiv.nativeElement.style.backgroundImage = `url(${this.url})`;
    this.imgDiv.nativeElement.className += ' glyphicon';
    this.profileLoaded = true;
    this.showSpinner = false;
  }

  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  private deleteFileStorage(userId: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.profilePath}/${userId}`).delete()
  }

  ngOnInit() {
  }

}
