import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/services/AuthService/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";

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
              private router: Router) {
  }

  ngOnInit(): void {
  }

  onLogin() {
    this.authService.loginByOldWay();
    this.router.navigateByUrl('dashboard');
  }

}
