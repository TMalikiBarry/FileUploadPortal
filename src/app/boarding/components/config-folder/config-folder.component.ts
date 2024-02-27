import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../core/services/userService/user.service";
import {UserInterface} from "../../../core/models/user.interface";
import {map, Observable, startWith, tap} from "rxjs";
import {NotifService} from "../../../core/services/notificationService/notif.service";
import {FileService} from "../../../core/services/FileService/file.service";
import {DossierInterface, EStatutDossier} from "../../../core/models/dossier.interface";
import {MatDialog} from "@angular/material/dialog";
import {SaveDossierComponent} from "../../dialogs/save-dossier/save-dossier.component";
import {Typage} from "../../../core/models/typage";
import {DisplayFileComponent} from "../../dialogs/display-file/display-file.component";
import {PARAGRAPH_MAP} from "../../../core/models/Constants";


export type FileType = 'cni_r' | 'cni_v' | 'geoloc' | 'honneur' | 'connaissance' | 'CGU' | 'residence' | 'statut';


@Component({
  selector: 'app-config-folder',
  templateUrl: './config-folder.component.html',
  styleUrls: ['./config-folder.component.scss'],
})
export class ConfigFolderComponent implements OnInit {

  searchFile: string = '';
  currentAgent!: UserInterface;
  idAgent!: number;
  typeAgent = 'informel'
  currentFile?: File;
  fileMap: Map<FileType, File | undefined> = new Map();
  progressMap = new Map();
  fileNameMap = new Map();
  informelMapKeys: FileType[] = ['cni_r', 'cni_v', 'honneur', 'connaissance', 'CGU'];
  formelMapKeys: FileType[] = [...this.informelMapKeys, 'statut', 'residence'];
  fileType!: FileType;
  step = 2;
  lesDossiers$!: Observable<DossierInterface[]>;
  showDossiersAgent$!: Observable<boolean>;

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
      this.getAgentDossiers();
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
      this.fileMap.set(fileType, this.currentFile);

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
      this.fileService.uploadFile(this.currentFile, Typage[fileType]).subscribe({
        next: value => {
          this.notify.snackMessage('Chargement avec succès de ' + this.fileMap.get(fileType)!.name, 2000, 'success');
          this.progressMap.set(fileType, 100);
          this.fileNameMap.set(fileType, value.data.toString())
        },
        error: err => {
          this.fileMap.delete(fileType);
          this.notify.snackMessage('Echec du chargement du fichier ' + err.message, 5000, 'danger');
        },
      });
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step = 3;
  }

  prevStep() {
    this.step = 2;
  }

  onUpload(fileType: FileType) {
    this.currentFile = undefined;
    document.getElementById('file_uploader')?.click();
    this.fileType = fileType;
  }

  getParagraphMessageByType(fileType: FileType): string {
    return PARAGRAPH_MAP[fileType] || '';
  }

  getTooltipContent(fileType: 'gotImage' | 'document'): string {
    return fileType === 'gotImage' ? 'Le format de fichier autorisé est pdf (application/pdf). Veuillez ' +
      'scanner si c\'est une image'
      : 'Les types de fichier autorisés sont les documents pdf, veuillez convertir si c\'est autre';
  }

  allowSaveDossier(): boolean {
    /*    if (this.positionForm.invalid) {
          return false;
        }*/
    const value = 100;
    const keys = this.typeAgent === 'informel' ? this.informelMapKeys : this.formelMapKeys;
    // keys.forEach(key => console.log(this.progressMap.get(key)));
    return keys.every(key => this.progressMap.get(key) === value);
  }

  onSaveDossier() {
    if (this.allowSaveDossier()) {
      const keys = this.typeAgent === 'informel' ? this.informelMapKeys : this.formelMapKeys;
      let dossiers: DossierInterface[] = [];

      keys.forEach(key => {
        dossiers.push({
          name: this.fileNameMap.get(key),
          uploadingFile: this.fileMap.get(key)!.name,
          statut: EStatutDossier.VALIDER,
          typeFile: Typage[key],
          acces: this.currentAgent
        })
      });
      this.fileService.saveAgentDossier(dossiers).pipe(
        tap(() => {
          const dialogRef = this.dialog.open(SaveDossierComponent, {
            data: {
              agentName: this.currentAgent.name,
            },
            maxWidth: '25rem',
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.getAgentDossiers();
            }
          })
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
        this.notify.snackMessage(`Ficher ${this.fileMap.get(typeFile)!.name} retiré avec succès`, 2000, 'success');
        this.progressMap.set(typeFile, 10);
        this.fileMap.delete(typeFile);
      },
    })
  }

  getAgentDossiers() {
    this.lesDossiers$ = this.fileService.getAgentDossiers(this.idAgent).pipe(
      map(response => <DossierInterface[]>response.data)
    )
    this.showDossiersAgent$ = this.fileService.getAgentDossiers(this.idAgent).pipe(
      map(response => <DossierInterface[]>response.data),
      map(dossiers => dossiers && dossiers.length > 0),
      startWith(true),
    )
    // this.lesDossiers$.pipe(
    //   map(dossiers => dossiers[0]),
    //   tap(dossier=> {
    //     if (dossier) {
    //       this.geolocalisation = dossier.geolocalisation;
    //       this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl('http://www.openstreetmap.org/query?map=15/'+this.geolocalisation.latitude+'/'
    //         +this.geolocalisation.longitude);
    //     }
    //
    //   }),
    // ).subscribe();
  }

  onDeleteAgentDossiers() {
    this.fileService.deleteAgentDossiers(this.idAgent).subscribe({
      next: () => {
        this.notify.snackMessage(`Les fichiers du dossier de l'agent ${this.currentAgent!.name} ont été supprimé avec succès`,
          3000, 'success');
        this.showDossiersAgent$ = this.lesDossiers$.pipe(
          map((dossiers) => dossiers && dossiers.length > 0),
        )
      },
    })
  }

  onDisplayFile(dossier: DossierInterface) {
    console.log('cliqué ');
    console.dir(dossier)
    this.dialog.open(DisplayFileComponent, {
      data: {
        fileSrc: dossier.uploadingFile,
        fileName: dossier.name,
        agentName: this.currentAgent.name,
        typeFile: dossier.typeFile
      },
      maxWidth: '90vw',
      maxHeight: '95vh',
    });
  }

  /*  getFormControlErrorText(ctrl: AbstractControl) {
      if (ctrl.hasError('required')) {
        return 'Ce champ est requis';
      } else if (ctrl.hasError('email')) {
        return 'veuillez renseignez un format d\'email correct';
      } else if (ctrl.hasError('pattern')) {
        return 'Ce format de donnée n\'est pas autorisé';
      } else if (ctrl.hasError('minlength')) {
        return 'Nom d\'utilisateur trop court';
      } else if (ctrl.hasError('maxlength')) {
        return 'Nom d\'utilisateur trop long';
      } else {
        return 'Ce champ contient une erreur';
      }
    }*/

  onDownloadTemplate(templateName: string) {
    if (templateName === 'Declaration_Honneur') {
      this.notify.snackMessage('Le template Déclaration sur l\'honneur n\'est pas encore fourni',
        2500, 'danger');
      return;
    }
    // window.open('../../../assets/fileTemplates/Fiche_Connaissance.xlsx');
    let link = document.createElement("a");
    let myUrl = "assets/fileTemplates/" + templateName + ".xlsx";
    link.download = "Fiche_Connaissance";
    link.href = myUrl;
    link.click();
  }
}
