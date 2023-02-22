import {Component, OnInit} from '@angular/core';
import {DossierInterface} from "../../../core/models/dossier.interface";
import {FileService} from "../../../core/services/FileService/file.service";
import {map, Observable} from "rxjs";
import {UserInterface} from "../../../core/models/user.interface";
import {DisplayFileComponent} from "../../dialogs/display-file/display-file.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  myInfos!: UserInterface;
  mesDossiers$!: Observable<DossierInterface[]>;

  constructor(private fileService: FileService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.myInfos = <UserInterface>JSON.parse(localStorage.getItem('commercant')!);
    this.mesDossiers$ = this.fileService.getAgentDossiers(this.myInfos.id).pipe(
      map(res => res.data as DossierInterface[])
    );
  }

  onDisplayFile(dossier: DossierInterface) {
    this.dialog.open(DisplayFileComponent, {
      data: {
        fileSrc: dossier.uploadingFile,
        fileName: dossier.name,
        agentName: this.myInfos.name,
        typeFile: dossier.typeFile
      },
      maxWidth: '90vw',
      maxHeight: '95vh',
    });
  }

}
