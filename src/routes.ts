import { Routes } from '@angular/router';
import { LoginFormComponent } from './app/login-form/login-form.component';
import { SignupFormComponent } from './app/signup-form/signup-form.component';
import { ChatroomComponent } from './app/chatroom/chatroom.component';
import { EditUserComponent } from './app/edit-user/edit-user.component';
import { UserDetailsComponent } from './app/user-details/user-details.component';
import { UserPanelComponent } from './app/user-panel/user-panel.component';
import { AuthenticationGuardService } from './app/services/authentication-guard.service';

export const appRoutes: Routes = [
    { path: 'signup', component: SignupFormComponent },
    { path: 'login', component: LoginFormComponent },
    { path: 'chat', component: ChatroomComponent, canActivate: [AuthenticationGuardService] },
    { path: 'edit', component: EditUserComponent, canActivate: [AuthenticationGuardService] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login', pathMatch: 'full' }
];