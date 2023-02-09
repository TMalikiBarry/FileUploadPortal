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
      console.log(this.loginForm.value)
  }

  onLogin() {
    // this.authService.testChargerFichier().subscribe({
    //   next: response=>{
    //     FileSaver.saveAs(response.body!, 'fileName.pdf');
    //     /*const url = window.URL.createObjectURL(response.data!);
    //     const a = document.createElement('a');
    //     document.body.appendChild(a);
    //     a.setAttribute('style', 'display: none');
    //     a.href = url;
    //     a.download = response.fileName;
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     a.remove();*/
    //   }
    // });

    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;

    if (typeof username === "string" && typeof password === "string") {
      this.authService.login(username, password)
        .subscribe({
          next: (user) => {
            this.authService.authenticateUser(user).subscribe({
              next: (data) => {
                console.log("data " + data)
                if (this.authService.currentUserValue) {
                  console.log("login.ts " + this.authService.currentUserValue.roles)
                  this.router.navigateByUrl('/dashboard/mes-agents');
                  this.notif.snackMessage(`Bienvenue Commerçant ${username}`, 2000, 'success');
                }
                this.loginForm.reset();
              }
            })
          },
          error: (err) => {
            console.log(err);
            this.notif.snackMessage("Identifiant ou mot de passe incorrect", 4000, "danger");
            this.loginForm.reset();
          }
        })
    }
    this.loginForm.reset();
  }

}
