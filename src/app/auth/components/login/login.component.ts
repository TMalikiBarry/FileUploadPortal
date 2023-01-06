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
    username: ['', Validators.required],
    password: ['', Validators.required]
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
    /*this.authService.loginByOldWay();
    this.router.navigateByUrl('dashboard');*/
    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;

    if (typeof username === "string" && typeof password === "string") {
      this.authService.login(username, password)
        .subscribe({
          next: (user) => {
            this.authService.authentificateUser(user).subscribe({
              next: (data) => {
                console.log("data " + data)
                if (this.authService.currentUserValue) {
                  console.log("login.ts " + this.authService.currentUserValue.roles)
                  this.router.navigateByUrl('/dashboard');
                  this.notif.snackMessage("Bienvenue", 2000, 'success');
                }
              }
            })
          },
          error: (err) => {
            console.log(err);
            this.notif.snackMessage("Identifiant ou mot de passe incorrect", 4000, "danger");
            /*this._snackBar.openFromComponent(DialogAlertComponent, {
              data: "Identifiant ou mot de passe incorrect",
              duration: 5000,
              verticalPosition: "top",
              horizontalPosition: "end",
              panelClass: ["custom-style-delete"]
            })*/
          }
        })
    }
  }

}
