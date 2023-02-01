import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NotifService} from "../../../core/services/notificationService/notif.service";
import {MatDialog} from "@angular/material/dialog";
import {FileService} from "../../../core/services/FileService/file.service";
import {FileType} from "../config-folder/config-folder.component";
import {UserInterface} from "../../../core/models/user.interface";
import {map, Observable} from "rxjs";
import {DossierInterface} from "../../../core/models/dossier.interface";
import {Typage} from "../../../core/models/typage";
import {DisplayFileComponent} from "../../dialogs/display-file/display-file.component";
import {DESCRIBER_MAP, H1_LIST_TITLE} from "../../../core/models/Constants";

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
      console.error(message);
    }
    if (this.commercant && this.typeFile) {
      this.lesDossiers$ = this.fileService
        .getAllDossiersAgentsByType(this.commercant.id, Typage[this.typeFile]).pipe(
          map((response) => <DossierInterface[]>response.data),
        );
      this.showDossiers$ = this.lesDossiers$.pipe(
        map(dossiers => (dossiers && dossiers.length > 0)),
      );
    }
  }

  onDisplayFile(dossier: DossierInterface) {
    /*let assetUrl = '../../../../assets/pdfTest/CV_Alioune.pdf';
    let srcTest = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
    let opclUrl = 'https://openclassrooms.com/en/course-certificates/1375982211';*/
    console.log(dossier)
    this.dialog.open(DisplayFileComponent, {
      data: {
        fileSrc: dossier.uploadingFile,
        // fileSrc: PDF_TEST_URLS[Math.floor(Math.random() * 4.5)],
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
