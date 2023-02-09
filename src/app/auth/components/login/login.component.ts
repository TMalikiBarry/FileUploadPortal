import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/services/AuthService/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {NotifService} from "../../../core/services/notificationService/notif.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required]
  });
  showPassword = false;

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private notif: NotifService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  onLogin() {
    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;

    if (typeof username === "string" && typeof password === "string") {
      this.authService.login(username, password)
        .subscribe({
          next: (user) => {
            this.authService.authenticateUser(user).subscribe({
              next: () => {
                if (this.authService.currentUserValue) {
                  this.router.navigateByUrl('/dashboard/mes-agents');
                  this.notif.snackMessage(`Bienvenue Commerçant ${username}`, 2000, 'success');
                }
                this.loginForm.reset();
              }
            })
          },
          error: () => {
            this.notif.snackMessage("Identifiant ou mot de passe incorrect", 4000, "danger");
            this.loginForm.reset();
          }
        })
    }
    this.loginForm.reset();
  }

}
