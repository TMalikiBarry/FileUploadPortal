import {Component, OnInit} from '@angular/core';

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  COMMERCANT = "COMMERCANT",
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
