import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../core/services/userService/user.service";
import {UserInterface} from "../../../core/models/user.interface";
import {map, tap} from "rxjs";
import {NotifService} from "../../../core/services/notificationService/notif.service";
import {FileService} from "../../../core/services/FileService/file.service";
import {DossierInterface} from "../../../core/models/dossier.interface";
import {MatDialog} from "@angular/material/dialog";
import {SaveDossierComponent} from "../../dialogs/save-dossier/save-dossier.component";
import {Typage} from "../../../core/models/typage";


export type FileType = 'cni_r' | 'cni_v' | 'geoloc' | 'honneur' | 'connaissance' | 'CGU' | 'residence' | 'statut';

@Component({
  selector: 'app-config-folder',
  templateUrl: './config-folder.component.html',
  styleUrls: ['./config-folder.component.scss']
})
export class ConfigFolderComponent implements OnInit {

  currentAgent!: UserInterface;
  idAgent!: number;
  typeAgent = 'informel'
  currentFile?: File;
  fileMap: Map<FileType, File | undefined> = new Map();
  progressMap = new Map();
  informelMapKeys: FileType[] = ['cni_r', 'cni_v', 'geoloc', 'honneur', 'connaissance', 'CGU'];
  formelMapKeys: FileType[] = [...this.informelMapKeys, 'statut', 'residence'];
  fileType!: FileType;
  showDossiersAgent: boolean = false;
  paragraphMap: { [key in FileType]: string } = {
    'cni_r': 'Recto de la CNI',
    'cni_v': 'Verso de la CNI',
    'geoloc': 'Géolocalisation du point',
    'honneur': 'Déclaration de l\'honneur',
    'connaissance': 'Fiche de Connaissance',
    'CGU': 'Conditions (CGU)',
    'residence': 'Contrat de location',
    'statut': 'Statut de l\'entreprise'
  };

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private notify: NotifService,
              private dialog: MatDialog,
              private fileService: FileService) {
  }

  ngOnInit(): void {
    try {
      this.idAgent = +this.route.snapshot.params["id"];
    } catch ({message}) {
      console.error(message);
    }
    if (this.idAgent) {
      this.userService.getUser(this.idAgent).pipe(
        map(response => <UserInterface>response.data),
        tap(response => {
          this.currentAgent = response;
          this.userService.saveInLocal('agent', JSON.stringify(response));
        }),
      ).subscribe({
        next: () => {
          if (!this.currentAgent) {
            this.currentAgent = JSON.parse(this.userService.getLocalValue('agent'));
          }
        },
      });
    }
  }

  getEvent(event: Event) {
    let fileType = this.fileType;
    this.progressMap.set(fileType, 10);
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length) {
      this.currentFile = target?.files[0];
    }
    if (this.currentFile) {
      console.log(" Le type du fichier " + this.currentFile.type);
      console.log(" La taille du fichier " + this.currentFile.size);
      this.fileMap.set(fileType, this.currentFile);
      // console.log("TEST FONCTION ", this.getTypeByVariable(this.file_cni_r));

      if (!this.fileService.isTypeFilePDF(this.currentFile)) {
        this.notify.snackMessage('Ce type de fichier n\'est pas pris en compte', 4000, 'danger');
        this.currentFile = undefined;
        this.fileMap.delete(fileType);
        return;
      }
      if (!this.checkFileSize(fileType, this.currentFile)) {
        let taille = fileType.includes('cni') ? 6 : 3;
        this.notify.snackMessage('La taille du fichier ne doit pas dépasser ' + taille + ' MB', 4000, 'danger');
        this.currentFile = undefined;
        this.fileMap.delete(fileType);
        return;
      }
      let type = Typage[fileType];
      this.fileService.uploadFile(this.currentFile, type).subscribe({
        next: value => {
          this.notify.snackMessage('Upload avec succès' + value.toString(), 5000, 'success');
          this.progressMap.set(fileType, 100);
        },
        error: err => {
          if (err == 'OK') {
            this.notify.snackMessage('Upload avec succès', 5000, 'success');
            this.progressMap.set(fileType, 100);
          } else {
            console.error(err.toString());
            this.fileMap.delete(fileType);
            this.notify.snackMessage('Error while uploading ' + err.message, 5000, 'danger');
          }
        },
      });
    }
  }

  onUpload(fileType: FileType) {
    document.getElementById('file_uploader')?.click();
    this.fileType = fileType;
  }

  getParagraphMessageByType(fileType: FileType) {
    return this.paragraphMap[fileType] || '';
  }

  getTooltipContent(fileType: 'gotImage' | 'document'): string {
    return fileType === 'gotImage' ? 'Le format de fichier autorisé est pdf (application/pdf). Veuillez ' +
      'scanner si c\'est une image'
      : 'Les types de fichier autorisés sont les documents pdf, veuillez convertir si c\'est autre';
  }

  allowSaveDossier(): boolean {
    const value = 100;
    const keys = this.typeAgent === 'informel' ? this.informelMapKeys : this.formelMapKeys;
    return keys.every(key => this.progressMap.get(key) === value);
  }

  onSaveDossier() {
    if (this.allowSaveDossier()) {
      const keys = this.typeAgent === 'informel' ? this.informelMapKeys : this.formelMapKeys;
      let dossiers: DossierInterface[] = [];

      keys.forEach(key => {
        dossiers.push({
          name: Typage[key] + '_' + this.fileMap.get(key)!.name,
          uploadingFile: this.fileMap.get(key)!.name,
          typeFile: Typage[key],
          acces: this.currentAgent
        })
      });
      this.fileService.saveAllDossier(dossiers).pipe(
        tap(() => {
          const dialogRef = this.dialog.open(SaveDossierComponent, {
            data: {
              agentName: this.currentAgent.name,
              isOK: true
            },
            maxWidth: '25rem',
          });

        }),
      ).subscribe();

    } else {
      this.notify.snackMessage('Vous n\'avez pas chargés tous les fichiers', 4000, "danger");
    }
  }

  checkFileSize(filetype: FileType, file?: File): boolean {
    return filetype.includes('cni') ? this.fileService.checkSize(file!, 'selfieIdentity') :
      this.fileService.checkSize(file!, 'notSelfie')
  }

  removeFile(typeFile: FileType) {
    const fileName = Typage[typeFile] + '_' + this.fileMap.get(typeFile)!.name;
    this.fileService.removeFile(fileName).pipe(
      tap((message) => {
        this.notify.snackMessage(message.toString(), 1500, 'success');
      })
    ).subscribe({
      next: () => {
        this.progressMap.set(typeFile, 10);
        this.fileMap.delete(typeFile);
      },
      error: err => {
        if (err == 'OK') {
          this.notify.snackMessage(`Ficher ${this.fileMap.get(typeFile)!.name} retiré avec succès`, 5000, 'success');
          this.progressMap.set(typeFile, 10);
          this.fileMap.delete(typeFile);
        }
      }
    })
  }
}
