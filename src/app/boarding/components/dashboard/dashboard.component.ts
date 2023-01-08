import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/services/AuthService/auth.service";
import {tap} from "rxjs";
import {Router} from "@angular/router";
import {UserService} from "../../../core/services/userService/user.service";
import {UserInterface} from "../../../core/models/user.interface";

export enum Role {
  USER = "USER",
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

  commercant!: UserInterface

  constructor(private authService: AuthService, private router: Router, private userSevice: UserService) {
  }

  ngOnInit(): void {
    this.commercant = this.userSevice.getCommercant();
  }

  logOut() {
    this.authService.logout().pipe(
      tap(() => this.router.navigateByUrl("/login"))
    ).subscribe();
  }

  /*onRedirect(agent: 'agent' | 'profil' | 'vFolders' | 'cFolder') {
    switch (agent) {
      case "profil": this.router.navigateByUrl('/dashboard/mon-profil'); break;
      case "agent": this.router.navigateByUrl('/dashboard/mes-agents'); break;
      case "vFolders": this.router.navigateByUrl('/dashboardvoir-dossiers'); break;
      case "cFolder": this.router.navigateByUrl('/dashboard/config-dossier'); break;
    }
  }*/
}
