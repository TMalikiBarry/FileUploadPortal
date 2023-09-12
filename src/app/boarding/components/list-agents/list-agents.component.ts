import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../../core/services/userService/user.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {UserInterface} from "../../../core/models/user.interface";
import {NotifService} from "../../../core/services/notificationService/notif.service";
import {Router} from "@angular/router";
import {map} from "rxjs";
import {DossierInterface} from "../../../core/models/dossier.interface";

@Component({
  selector: 'app-list-agents',
  templateUrl: './list-agents.component.html',
  styleUrls: ['./list-agents.component.scss']
})
export class ListAgentsComponent implements OnInit {

  dataSource !: MatTableDataSource<any>;
  columnsToDisplay = ['name', 'username', 'email', 'roles', 'id'];
  checkDossiers$ = new Map();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private notify: NotifService, private router: Router) {
  }

  ngOnInit(): void {
    this.getAgents();
    this.checkAgentGotDossiers();
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

  checkAgentGotDossiers() {
    this.userService.getMyAgents().pipe(
      map(res => <UserInterface[]>res.data),
      map(users => users.map(user => user.id)),
    ).subscribe({
      next: ids => {
        ids.forEach(id => {
          this.checkDossiers$.set(id, this.userService.getAgentDossiers(id).pipe(
            map(res => <DossierInterface[]>res.data),
            map(dossiers => (dossiers && dossiers.length > 0)),
          ));
        })
      }
    });
  }

  private getAgents() {
    this.userService.getMyAgents().pipe(
      map(res => {
        let myAgents = res.data as UserInterface[];
        // return myAgents.filter(agent => agent.roles?.some(role => role.code === 'OPERATEUR'))
        return myAgents.filter(agent => agent.roles?.code === 'OPERATEUR')
      })
    ).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(<UserInterface[]>data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.notify.snackMessage(err.toString(), 3000, "danger");
      }
    });
  }
}
