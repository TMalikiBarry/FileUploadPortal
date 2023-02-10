import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Typage, TypageReverse} from "../../../core/models/typage";
import {DESCRIBER_MAP} from "../../../core/models/Constants";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment.prod";
import * as FileSaver from "file-saver";

@Component({
  selector: 'app-display-file',
  templateUrl: './display-file.component.html',
  styleUrls: ['./display-file.component.scss']
})
export class DisplayFileComponent implements OnInit {

  httpURL = 'http://52.210.42.160:8085';
  httpsURL = 'https://dev-touch-ssii-api.gutouch.net';

  constructor(@Inject(MAT_DIALOG_DATA) public data:
                { fileSrc: string, fileName: string, agentName: string, typeFile: Typage },
              private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  getParagraph(typeFile: Typage): string {
    return DESCRIBER_MAP[TypageReverse[typeFile]];
  }

  protectedURL(): string {
    return this.data.fileSrc.replace(this.httpURL, this.httpsURL);
  }

  onDownLoad() {
    let fileName = this.data.fileName;
    this.http.get(`${environment.API_URL}/dossier/getFile/${fileName}`
      , {
        observe: 'response',
        responseType: 'blob'
      }).subscribe({
      next: response => {
        FileSaver.saveAs(response.body!, fileName);
      }
    })
  }
}
