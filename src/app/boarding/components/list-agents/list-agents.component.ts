import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../../core/services/userService/user.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {UserInterface} from "../../../core/models/user.interface";
import {NotifService} from "../../../core/services/notificationService/notif.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-agents',
  templateUrl: './list-agents.component.html',
  styleUrls: ['./list-agents.component.scss']
})
export class ListAgentsComponent implements OnInit {

  dataSource !: MatTableDataSource<any>;
  columnsToDisplay = ['name', 'username', 'email', 'roles', 'id'];

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private userService: UserService, private notify: NotifService, private router: Router) {
  }

  ngOnInit(): void {
    console.log("Infos des agents du commerçant " + this.userService.getMyAgents().subscribe());
    this.getAgents();
  }

  add() {

  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRedirect(id: number) {
    this.router.navigateByUrl(`dashboard/mes-agents/${id}`);
  }

  private getAgents() {
    this.userService.getMyAgents().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(<UserInterface[]>res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.notify.snackMessage(err.toString(), 3000, "danger");
        console.error(err);
      }
    })
  }
}
