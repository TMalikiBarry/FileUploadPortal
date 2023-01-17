import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../core/services/userService/user.service";
import {UserInterface} from "../../../core/models/user.interface";
import {map, Observable, tap} from "rxjs";
import {NotifService} from "../../../core/services/notificationService/notif.service";
import {FileService} from "../../../core/services/FileService/file.service";


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
  progressTest: number = 5;
  progress_cni_r?: number;
  progress_cni_v?: number;
  progress_geoloc?: number;
  progress_honneur?: number;
  progress_connaissance?: number;
  progress_CGU?: number;
  progress_residence?: number;
  progress_statut?: number;
  file_cni_r?: File;
  file_cni_v?: File;
  file_geoloc?: File;
  file_honneur?: File;
  file_connaissance?: File;
  file_CGU?: File;
  file_residence?: File;
  file_statut?: File;
  currentFile?: File;
  progress = 5;
  message = '';
  currentEvent!: Event;
  fileInfos?: Observable<File>;
  fileType!: FileType;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private notify: NotifService,
              private fileService: FileService) {
  }

  ngOnInit(): void {
    try {
      this.idAgent = +this.route.snapshot.params["id"];
    } catch ({message}) {
      console.log(message);
    }
    if (this.idAgent) {
      this.userService.getUser(this.idAgent).pipe(
        map(response => <UserInterface>response.data),
        tap(response => {
          this.currentAgent = response;
          this.userService.saveInLocal('agent', JSON.stringify(response));
        }),
      ).subscribe();
    }
    if (!this.currentAgent) {
      this.currentAgent = JSON.parse(this.userService.getLocalValue('agent'));
    }
  }

  getEvent(event: Event) {
    this.progress = 5;
    let fileType = this.fileType;
    this.currentEvent = event
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length) {
      this.currentFile = target?.files[0];
      this.dispatchVariableAndGetMessageByType(this.fileType, this.currentFile);
    }
    if (this.currentFile) {
      console.log(" Le type du fichier " + this.currentFile.type);
      console.log(" La taille du fichier " + this.currentFile.size);

      if (!this.checkFileType(fileType, this.currentFile)) {
        this.notify.snackMessage('Ce type de fichier n\'est pas pris en compte', 4000, 'danger');
        this.currentFile = undefined;
        this.resetVariables(fileType);
        return;
      }
      if (!this.checkFileSize(fileType, this.currentFile)) {
        let taille = fileType.includes('cni') ? 10 : 4;
        this.notify.snackMessage('La taille du fichier ne doit pas dépasser ' + taille + ' MB', 3000, 'danger');
        this.currentFile = undefined;
        this.resetVariables(fileType);
        return;
      }
      this.fileService.save(this.currentFile).subscribe({
        next: value => {
          this.notify.snackMessage('Upload avec succès ' + value.toString(), 5000, 'success');
          this.dispatchVariableAndGetMessageByType(this.fileType, this.currentFile, 100);
          this.progress = 100;
        },
        error: err => {
          if (err == 'OK') {
            this.notify.snackMessage('Upload avec succès ', 5000, 'success');
            this.dispatchVariableAndGetMessageByType(this.fileType, this.currentFile, 100);
            this.progress = 100;
          } else {
            console.error(err.status);
            this.notify.snackMessage('Error while uploading ' + err.toString(), 5000, 'danger');
          }
        },
        // complete: () => this.dispatchVariableAndGetMessageByType(this.fileType, this.currentFile, this.progress),
      });

      /*this.fileService.upload(this.currentFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.message= "WEEEAAH, upload avec succès";
            this.progress = Math.round(100 * event.loaded / event.total);
            this.dispatchVariableAndGetMessageByType(this.fileType, this.currentFile, this.progress);
          } else if (event instanceof HttpResponse) {
            this.message ='dans instance ' + event.body.message;
          }
          this.dispatchVariableAndGetMessageByType(this.fileType, this.currentFile, 100);
          this.notify.snackMessage(`Message : ${this.message}`, 700, "success");
          this.progressTest = 100;
        },
        error: (err: any) => {
          console.error(err);
          this.progress = 0;
          this.progressTest = 0;
          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }
          this.notify.snackMessage(this.message, 5000, "danger");
          this.currentFile = undefined;
        },
        complete: () =>
        {
          // this.notify.snackMessage('Dans complete', 4000, 'warning')
        }
      });*/
      this.resetVariables('default');
    }
  }

  onUpload(fileType: FileType) {
    document.getElementById('file_uploader')?.click();
    this.fileType = fileType;

  }

  setMessage(message: string) {
    this.message = message;
  }

  dispatchVariableAndGetMessageByType(fileType: FileType, file?: File, progress?: number) {
    let paragraph: string;
    switch (fileType) {
      case "cni_r":
        paragraph = 'Recto de la CNI';
        if (progress) {
          this.progress_cni_r = progress;
        }
        if (file)
          this.file_cni_r = file;
        break;
      case "cni_v":
        paragraph = 'Verso de la CNI';
        if (progress) {
          this.progress_cni_v = progress;
        }
        if (file)
          this.file_cni_v = file;
        break;
      case "geoloc":
        paragraph = 'Géolocalisation du point';
        if (progress) {
          this.progress_geoloc = progress;
        }
        if (file)
          this.file_geoloc = file;
        break;
      case "honneur":
        paragraph = 'Déclaration de l\'honneur';
        if (progress) {
          this.progress_honneur = progress;
        }
        if (file)
          this.file_honneur = file;
        break;
      case "connaissance":
        paragraph = 'Fiche de Connaissance';
        if (progress) {
          this.progress_connaissance = progress;
        }
        if (file)
          this.file_connaissance = file;
        break;
      case "CGU":
        paragraph = 'CGU';
        if (progress) {
          this.progress_CGU = progress;
        }
        if (file)
          this.file_CGU = file;
        break;
      case "residence":
        paragraph = 'Contrat de location';
        if (progress) {
          this.progress_residence = progress;
        }
        if (file)
          this.file_residence = file;
        break;
      case "statut":
        paragraph = 'Statut de l\'entreprise';
        if (progress) {
          this.progress_statut = progress;
        }
        if (file)
          this.file_statut = file;
        break;
      default:
        paragraph = 'Fichier';
        break;
    }
    return paragraph;
  }

  resetVariables(fileType: FileType | 'all' | 'default') {
    switch (fileType) {
      case "cni_r":
        this.file_cni_r = undefined;
        this.progress_cni_r = 5;
        break;
      case "cni_v":
        this.file_cni_v = undefined;
        this.progress_cni_v = 5;
        break;
      case "geoloc":
        this.file_CGU = undefined;
        this.progress_geoloc = 5;
        break;
      case "honneur":
        this.file_honneur = undefined;
        this.progress_honneur = 5;
        break;
      case "connaissance":
        this.file_connaissance = undefined;
        this.progress_connaissance = 5;
        break;
      case "CGU":
        this.file_CGU = undefined;
        this.progress_CGU = 5;
        break;
      case "residence":
        this.file_residence = undefined;
        this.progress_residence = 5;
        break;
      case "statut":
        this.file_statut = undefined;
        this.progress_statut = 5;
        break;
      case "all":
        this.file_cni_r = undefined;
        this.file_residence = undefined;
        this.file_CGU = undefined;
        this.file_geoloc = undefined;
        this.file_connaissance = undefined;
        this.file_honneur = undefined;
        this.file_cni_v = undefined;
        this.file_statut = undefined;
        this.progress_cni_r = 5;
        this.progress_cni_v = 5;
        this.progress_geoloc = 5;
        this.progress_honneur = 5;
        this.progress_connaissance = 5;
        this.progress_CGU = 5;
        this.progress_residence = 5;
        this.progress_statut = 5;
        break;
      case 'default':
        this.currentFile = undefined;
        this.progress = 5;
        break;
    }
  }

  getTooltipContent(fileType: 'gotImage' | 'document'): string {
    return fileType === 'gotImage' ? 'Les formats de fichier autorisés sont pdf, png, jpg, jpeg, rtf.'
      : 'Les type de fichier autorisés ici sont l\'image, les documents pdf et traitement de texte';
  }

  showSaveButton(): boolean {
    const value = 100;
    const formelVariables = [this.progress_cni_r, this.progress_cni_v, this.progress_geoloc, this.progress_honneur,
      this.progress_connaissance, this.progress_CGU, this.progress_residence, this.progress_statut];
    if (this.typeAgent === 'informel') {
      return (this.progress_cni_r === 100 && this.progress_cni_v === 100 && this.progress_geoloc === 100
        && this.progress_honneur === 100 && this.progress_connaissance === 100 && this.progress_CGU === 100)
    } else {
      return formelVariables.every(variable => variable === value);
    }
  }

  checkFileSize(filetype: FileType, file?: File): boolean {
    return filetype.includes('cni') ? this.fileService.checkSize(file!, 'selfieIdentity') :
      this.fileService.checkSize(file!, 'notSelfie')
  }

  checkFileType(filetype: FileType, file?: File): boolean {
    return filetype.includes('cni') ? this.fileService.checkTypeFile(file!.name, 'CNI') :
      this.fileService.checkTypeFile(file!.name, 'notCNI');
  }

  checkFile(fileType: FileType, file?: File) {
    console.log(" Le type du fichier " + file!.type);
    console.log(" La taille du fichier " + file!.size);

    if (!this.checkFileType(fileType, file)) {
      this.notify.snackMessage('Ce type de fichier n\'est pas pris en compte', 4000, 'danger');
      file = undefined;
      this.resetVariables(fileType);
      return;
    }
    if (!this.checkFileSize(fileType, file)) {
      let taille = fileType.includes('cni') ? 10 : 4;
      this.notify.snackMessage('La taille du fichier ne doit pas dépasser ' + taille + ' MB', 3000, 'danger');
      file = undefined;
      this.resetVariables(fileType);
      return;
    }
  }


  showPreviewImg(file: File): string {
    return URL.createObjectURL(file);
  }
}
