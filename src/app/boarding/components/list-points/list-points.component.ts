import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FileService} from "../../../core/services/FileService/file.service";
import {Typage} from "../../../core/models/typage";
import {map, tap} from "rxjs";
import {DossierInterface} from "../../../core/models/dossier.interface";
import {pointView} from "../view-one-folder/view-one-folder.component";
import {UserInterface} from "../../../core/models/user.interface";

@Component({
  selector: 'app-list-points',
  templateUrl: './list-points.component.html',
  styleUrls: ['./list-points.component.scss']
})
export class ListPointsComponent implements OnInit {

  dataSource !: MatTableDataSource<any>;
  columnsToDisplay = ['name', 'latitude', 'longitude', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fileService: FileService) {
  }

  ngOnInit(): void {
    let myId = (<UserInterface>JSON.parse(localStorage.getItem('commercant')!)).id;

    this.fileService.getAllDossiersAgentsByType(myId, Typage.cni_r).pipe(
      map(res => <DossierInterface[]>res.data),
      map(dossiers => dossiers.map(dossier => <pointView>{
        name: dossier.acces.name,
        latitude: dossier.geolocalisation.latitude,
        longitude: dossier.geolocalisation.longitude,
      })),
      tap(points => console.table(points)),
    ).subscribe({
      next: (points) => {
        this.dataSource = new MatTableDataSource(points);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
    });
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
