import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/services/AuthService/auth.service";
import {tap} from "rxjs";
import {Router} from "@angular/router";
import {UserService} from "../../../core/services/userService/user.service";
import {UserInterface} from "../../../core/models/user.interface";

export enum Role {
  ADMIN = "ADMIN",
  COMMERCANT = "COMMERCANT",
  AGENT = "AGENT"
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isOpen = true;

  commercant!: UserInterface;
  expanded = true;

  constructor(private authService: AuthService, private router: Router, private userSevice: UserService) {
  }

  ngOnInit(): void {
    // this.getMyCommercant();
    this.loadCommercant();
  }

  async loadCommercant() {
    const user = await this.userSevice.getCommercant();
    if (user) {
      this.commercant = user;
    } else {
      this.commercant = JSON.parse(this.userSevice.getLocalValue('commercant'));
    }
  }

  logOut() {
    this.authService.logout().pipe(
      tap(() => this.router.navigateByUrl("/login"))
    ).subscribe();
  }
}
