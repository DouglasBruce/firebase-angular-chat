import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from "angularfire2/database-deprecated";
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditUserComponent implements OnInit {

  @ViewChild('passwordInput') private passwordInput: ElementRef;
  @ViewChild('reauthPasswordInput') private reauthPasswordInput: ElementRef;
  @ViewChild('confirmPasswordInput') private confirmPasswordInput: ElementRef;
  @ViewChild('imgDiv') private imgDiv: ElementRef;
  @ViewChild('fileInput') private fileInput: ElementRef;

  user: Observable<firebase.User>;
  oldEmail: string;
  email: string;
  resetEmail: string;
  reauthEmail: string;
  password: string;
  reauthPassword: string;
  confirmPassword: string;
  oldDisplayName: string;
  displayName: string;
  uid: string;
  url: string;
  oldUrl: string;
  errorMsg: string;
  selectedProfilePic: FileList;
  showSpinner: boolean = true;
  success: boolean = false;
  hasForgotPassword: boolean = false;
  reauthenticated: boolean = false;
  passwordVisibility: boolean = false;
  reauthPasswordVisibility: boolean = false;
  private profilePath:string = '/profile';
  private userPath:string = '/users';

  constructor(private authService: AuthService, private db: AngularFireDatabase, private router: Router) { }

  ngOnInit() {
    this.user = this.authService.authUser();
    this.user.subscribe(user => {
      if(user) {
        this.uid = user.uid;
        const path = `/users/${this.uid}`;
        this.getUser(path).subscribe(a => {
          this.displayName = a.displayName;
          this.oldDisplayName = this.displayName;
          this.email = a.email;
          this.oldEmail = this.email;
          if (a.url !== 'null') {
            this.url = a.url;
            this.oldUrl = this.url;
          } else {
            this.url = 'null';
            this.oldUrl = this.url;
          }
        });
      }
    });
  }

  closeAlert(index: number) {
    if(index == 1) {
      this.success = null;
    }
  }

  forgotPassword() {
    this.hasForgotPassword = true;
  }

  yes() {
    var firebaseUser = firebase.auth().currentUser;
    const path = `${this.userPath}/${this.uid}`;
    this.db.object(path).remove();
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.profilePath}/${this.uid}`).delete()
    firebaseUser.delete().then(resolve => {
      this.router.navigate(['projects']);
    })
    .catch(error => this.errorMsg = error.message);
  }

  reset() {
    var auth = firebase.auth();
    auth.sendPasswordResetEmail(this.resetEmail).then(resolve => {
      this.hasForgotPassword = false;
      this.success = true;
      this.resetEmail = null;
    }).catch(error => this.errorMsg = error.message);
  }

  reauth() {
    var firebaseUser = firebase.auth().currentUser;
    var credential = firebase.auth.EmailAuthProvider.credential(
      this.reauthEmail,
      this.reauthPassword
    );
    firebaseUser.reauthenticateWithCredential(credential).then(resolve => {
      this.reauthenticated = true;
      this.setProfilePicUrl();
    })
    .catch(error => this.errorMsg = error.message);
  }

  getUser(path: string) {
    return this.db.object(path);
  }

  showPassword() {
    if(this.passwordInput.nativeElement.type === 'password' && this.confirmPasswordInput.nativeElement.type === 'password') {
      this.passwordInput.nativeElement.type = 'text';
      this.confirmPasswordInput.nativeElement.type = 'text';
      this.passwordVisibility = true;
    } else {
      this.passwordInput.nativeElement.type = 'password';
      this.confirmPasswordInput.nativeElement.type = 'password';
      this.passwordVisibility = false;
    }
  }

  showReauthPassword() {
    if(this.reauthPasswordInput.nativeElement.type === 'password') {
      this.reauthPasswordInput.nativeElement.type = 'text';
      this.reauthPasswordVisibility = true;
    } else {
      this.reauthPasswordInput.nativeElement.type = 'password';
      this.reauthPasswordVisibility = false;
    }
  }

  editProfilePic() {
    this.fileInput.nativeElement.click();
  }

  detectFiles(event) {
    this.selectedProfilePic = event.target.files;
    let file = this.selectedProfilePic.item(0);
    this.imgDiv.nativeElement.style.backgroundImage = `none`;
    this.showSpinner = true;
    this.imageUpload(file, this.authService.currentUserID, true);
  }

  imageUpload(file: File, userId: string, temp: boolean) {
    const storageRef = firebase.storage().ref();
    var imageName;
    if(temp) {
      imageName = userId + 'temp';
    } else {
      imageName = userId;
    }
    const uploadTask = storageRef.child(`${this.profilePath}/${imageName}`).put(file);
    
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
        if(!temp)
          this.saveFileUrl(this.url, userId);
        return undefined
      }
    );
  }

  // Writes the file details to the realtime db
  private saveFileUrl(url:string, userId: string) {
    const path = `${this.userPath}/${userId}`;
    const data = {
      url: url
    };

    this.db.object(path).update(data).then(resolve => {
      this.back();
    })
    .catch(error => this.errorMsg = error.message);
  }

  setProfilePicUrl() {
    if(this.imgDiv){
      if (this.url !== 'null') {
        this.imgDiv.nativeElement.style.backgroundImage = `url(${this.url})`;
      } else {
        this.imgDiv.nativeElement.style.backgroundImage = `url(assets/userIcon.png)`;
      }
      this.showSpinner = false;
    } else {
      setTimeout(() => this.setProfilePicUrl(), 1000);
    }
  }

  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  private deleteFileStorage(userId: string) {
    const imageName = userId + 'temp';
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.profilePath}/${imageName}`).delete()
  }

  save() {
    var firebaseUser = firebase.auth().currentUser;
    const path = `users/${this.uid}`;

    if(this.oldEmail !== this.email) {
      firebaseUser.updateEmail(this.email)
      .catch(error => this.errorMsg = error.message);
    }

    if(this.password === this.confirmPassword && this.password != undefined) {
      firebaseUser.updatePassword(this.password)
      .catch(error => this.errorMsg = error.message);
    }

    if(this.oldDisplayName !== this.displayName || this.oldEmail !== this.email) {
      firebaseUser.updateProfile({
        displayName: this.displayName,
        photoURL: null
      });
      const data = {
        email: this.email,
        displayName: this.displayName
      };

      this.db.object(path).update(data)
      .catch(error => this.errorMsg = error.message);
    }

    if (this.selectedProfilePic) {
      let file = this.selectedProfilePic.item(0);
      this.imageUpload(file, this.authService.currentUserID, false);
    } else {
      this.saveFileUrl(this.url, this.uid);
    }
  }

  back() {
    if (this.selectedProfilePic) {
      this.deleteFileStorage(this.authService.currentUserID);
    }
    this.router.navigate(['chat']);
  }

}
