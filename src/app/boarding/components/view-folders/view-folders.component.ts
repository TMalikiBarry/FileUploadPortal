import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FileType} from "../config-folder/config-folder.component";
import {H1_LIST_TITLE} from "../../../core/models/Constants";

@Component({
  selector: 'app-view-folders',
  templateUrl: './view-folders.component.html',
  styleUrls: ['./view-folders.component.scss']
})
export class ViewFoldersComponent implements OnInit {

  keys: FileType[] = ['cni_r', 'cni_v', 'geoloc', 'honneur', 'connaissance', 'CGU', 'residence', 'statut'];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  getParagraph(fileType: FileType): string {
    return H1_LIST_TITLE[fileType] || '';
  }

  onRedirect(typeFile: FileType) {
    this.router.navigateByUrl(`dashboard/voir-documents/${typeFile}`);
  }

}
