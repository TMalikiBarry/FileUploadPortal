import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NotifService} from "../../../core/services/notificationService/notif.service";
import {MatDialog} from "@angular/material/dialog";
import {FileService} from "../../../core/services/FileService/file.service";
import {FileType} from "../config-folder/config-folder.component";
import {UserInterface} from "../../../core/models/user.interface";
import {map, Observable, tap} from "rxjs";
import {DossierInterface} from "../../../core/models/dossier.interface";
import {Typage} from "../../../core/models/typage";
import {DisplayFileComponent} from "../../dialogs/display-file/display-file.component";
import {DESCRIBER_MAP, H1_LIST_TITLE} from "../../../core/models/Constants";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

export interface pointView {
  name: string,
  latitude: string,
  longitude: string,
}
@Component({
  selector: 'app-view-one-folder',
  templateUrl: './view-one-folder.component.html',
  styleUrls: ['./view-one-folder.component.scss']
})
export class ViewOneFolderComponent implements OnInit {

  typeFile!: FileType
  commercant!: UserInterface;
  lesDossiers$!: Observable<DossierInterface[]>;

  showDossiers$!: Observable<boolean>;

  dataSource !: MatTableDataSource<any>;
  columnsToDisplay = ['name', 'latitude', 'longitude', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute,
              private notify: NotifService,
              private dialog: MatDialog,
              private fileService: FileService) {
  }

  ngOnInit(): void {
    try {
      this.typeFile = <FileType>this.route.snapshot.params["type"];
      this.commercant = JSON.parse(localStorage.getItem('commercant')!);
    } catch ({message}) {
    }
    if (this.commercant && this.typeFile) {
      if (this.typeFile == 'geoloc') {
        this.showDossiers$ = this.fileService.getAllDossiersAgentsByType(this.commercant.id, Typage.cni_r).pipe(
          map(res => <DossierInterface[]>res.data),
          map(dossiers => (dossiers && dossiers.length > 0)),
        );
        this.fileService.getAllDossiersAgentsByType(this.commercant.id, Typage.cni_r).pipe(
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
      } else {
        this.lesDossiers$ = this.fileService
          .getAllDossiersAgentsByType(this.commercant.id, Typage[this.typeFile]).pipe(
            map((response) => <DossierInterface[]>response.data),
          );
        this.showDossiers$ = this.lesDossiers$.pipe(
          map(dossiers => (dossiers && dossiers.length > 0)),
        );
      }

    }
  }

  onDisplayFile(dossier: DossierInterface) {
    this.dialog.open(DisplayFileComponent, {
      data: {
        fileSrc: dossier.uploadingFile,
        fileName: dossier.name,
        agentName: dossier.acces.name,
        typeFile: dossier.typeFile
      },
      maxWidth: '90vw',
      maxHeight: '95vh',
    });
  }

  getH1Title(): string {
    return H1_LIST_TITLE[this.typeFile];
  }

  getDescription(): string {
    return DESCRIBER_MAP[this.typeFile];
  }

}
