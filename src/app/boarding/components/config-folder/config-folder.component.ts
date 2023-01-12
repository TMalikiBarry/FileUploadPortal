import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../core/services/userService/user.service";
import {UserInterface} from "../../../core/models/user.interface";
import {map, Observable, tap} from "rxjs";
import {NotifService} from "../../../core/services/notificationService/notif.service";
import {FileService} from "../../../core/services/FileService/file.service";

@Component({
  selector: 'app-config-folder',
  templateUrl: './config-folder.component.html',
  styleUrls: ['./config-folder.component.scss']
})
export class ConfigFolderComponent implements OnInit {

  currentAgent!: UserInterface;
  idAgent!: number;
  progressTest: number = 2;
  progress_cni_r?: number;
  progress_cni_v?: number;
  progress_geoloc?: number;
  progress_honneur?: number;
  progress_connaissance?: number;
  progress_CGU?: number;
  progress_residence?: number;
  file_cni_r?: File;
  file_cni_v?: File;
  file_geoloc?: File;
  file_honneur?: File;
  file_connaissance?: File;
  file_CGU?: File;
  file_residence?: File;
  currentFile?: File;
  progress = 2;
  message = '';
  currentEvent!: Event;
  fileInfos?: Observable<File>;
  fileType!: 'cni_r' | 'cni_v' | 'geoloc' | 'honneur' | 'connaissance' | 'CGU' | 'residence';

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
      let checkFileType = fileType.includes('cni') ? this.fileService.checkTypeFile(this.currentFile.name, 'CNI') :
        this.fileService.checkTypeFile(this.currentFile.name, 'notCNI');
      let checkFileSize = fileType.includes('cni') ? this.fileService.checkSize(this.currentFile, 'selfieIdentity') :
        this.fileService.checkSize(this.currentFile, 'notSelfie');

      if (!checkFileType) {
        this.notify.snackMessage('Ce type de fichier n\'est pas pris en compte', 4000, 'danger');
        this.currentFile = undefined;
        this.resetVariables(this.fileType);
        return;
      }
      if (!checkFileSize) {
        let taille = fileType.includes('cni') ? 10 : 4;
        this.notify.snackMessage('La taille du fichier ne doit pas dépasser ' + taille + ' MB', 3000, 'danger');
        this.currentFile = undefined;
        this.resetVariables(this.fileType);
        return;
      }


      this.fileService.save(this.currentFile).subscribe({
        next: value => {
          this.notify.snackMessage('Upload avec succès' + value.data.toString(), 5000, 'success');
          this.progress = 100;
          // this.dispatchVariableAndGetMessageByType(this.fileType, this.currentFile, 100)
        },
        error: err => {
          console.error(err);
          this.notify.snackMessage('Error while uploading ' + err.toString(), 5000, 'danger');
        }
      });
      this.dispatchVariableAndGetMessageByType(this.fileType, this.currentFile, this.progress);

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
      this.currentFile = undefined;
    }
  }

  onUpload(fileType: 'cni_r' | 'cni_v' | 'geoloc' | 'honneur' | 'connaissance' | 'CGU' | 'residence') {
    document.getElementById('file_uploader')?.click();
    this.fileType = fileType;

  }

  setMessage(message: string) {
    this.message = message;
  }

  dispatchVariableAndGetMessageByType(fileType: 'cni_r' | 'cni_v' | 'geoloc' | 'honneur' | 'connaissance'
    | 'CGU' | 'residence', file?: File, progress?: number) {
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
      default:
        paragraph = 'Fichier';
        break;
    }
    return paragraph;
  }

  resetVariables(fileType: 'cni_r' | 'cni_v' | 'geoloc' | 'honneur' | 'connaissance' | 'CGU' | 'residence' | 'all') {
    switch (fileType) {
      case "cni_r":
        this.file_cni_r = undefined;
        this.progress_cni_r = 2;
        break;
      case "cni_v":
        this.file_cni_v = undefined;
        this.progress_cni_v = 2;
        break;
      case "geoloc":
        this.file_CGU = undefined;
        this.progress_geoloc = 2;
        break;
      case "honneur":
        this.file_honneur = undefined;
        this.progress_honneur = 2;
        break;
      case "connaissance":
        this.file_connaissance = undefined;
        this.progress_connaissance = 2;
        break;
      case "CGU":
        this.file_CGU = undefined;
        this.progress_CGU = 2;
        break;
      case "residence":
        this.file_residence = undefined;
        this.progress_residence = 2;
        break;
      case "all":
        this.file_cni_r = undefined;
        this.file_residence = undefined;
        this.file_CGU = undefined;
        this.file_geoloc = undefined;
        this.file_connaissance = undefined;
        this.file_honneur = undefined;
        this.file_cni_v = undefined;
        this.progress_cni_r = 2;
        this.progress_cni_v = 2;
        this.progress_geoloc = 2;
        this.progress_honneur = 2;
        this.progress_connaissance = 2;
        this.progress_CGU = 2;
        this.progress_residence = 2;
        break;
      default:
        break;
    }
  }

  getTooltipContent(fileType: 'gotImage' | 'document'): string {
    return fileType === 'gotImage' ? 'Les formats de fichier autorisés sont pdf, png, jpg, jpeg, rtf.'
      : 'Les type de fichier autorisés ici sont l\'image, les documents pdf et traitement de texte';
  }

}
