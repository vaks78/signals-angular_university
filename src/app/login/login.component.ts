import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {MessagesService} from "../services/messages.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import { USER_STORAGE_KEY } from '../constants';

@Component({
    selector: 'login',
    imports: [
        RouterLink,
        ReactiveFormsModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    fb = inject(FormBuilder);
    messagesService = inject(MessagesService);
    authService = inject(AuthService);
    router = inject(Router);

    form = this.fb.group({
        email:[''],
        password: ['']
    });


    async onLogin() {
        try{
            const {email, password} = this.form.value;
            if (!email || !password) {
                this.messagesService.showMessage('error', 'Please enter email and password');
                return;
            }
            await this.authService.login(email, password);
            this.messagesService.showMessage('info', 'Login successful');
            console.log('Login successful');
            // Navigate to home page after successful login
            this.router.navigate(['/home']);
            

        }
        catch (err) {
            this.messagesService.showMessage('error', 'Login failed');
            console.error('Auth error: ' , err);
        }
    }
}
