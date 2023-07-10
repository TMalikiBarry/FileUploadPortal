import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/services/AuthService/auth.service";
import {Router} from "@angular/router";
import {UserService} from "../../../core/services/userService/user.service";
import {UserInterface} from "../../../core/models/user.interface";

export enum Role {
  COMMERCANT = "COMMERCANT",
  SUPERVISEUR = "SUPERVISEUR"
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isOpen = true;

  commercant!: UserInterface;

  constructor(public authService: AuthService, public router: Router, private userSevice: UserService) {
  }

  ngOnInit(): void {
    // let user = JSON.parse(localStorage.getItem('currentUser')!);
    // this.commercant$ = this.userSevice.getUser(user.id).pipe(
    //   map(res => res.data as UserInterface)
    // );
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
    this.authService.logout().subscribe();
  }
}
