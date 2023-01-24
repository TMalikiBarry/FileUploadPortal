import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FileType} from "../config-folder/config-folder.component";

@Component({
  selector: 'app-view-folders',
  templateUrl: './view-folders.component.html',
  styleUrls: ['./view-folders.component.scss']
})
export class ViewFoldersComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  onRedirect(typeFile: FileType) {
    this.router.navigateByUrl(`dashboard/voir-documents/${typeFile}`);
  }

}
