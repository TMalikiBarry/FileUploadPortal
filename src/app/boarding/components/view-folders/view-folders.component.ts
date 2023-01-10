import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

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

  onRedirect(typeFile: 'cni' | 'geoloc' | 'honneur' | 'connaissance' | 'CGU' | 'residence') {
    this.router.navigateByUrl(`dashboard/voir-documents/${typeFile}`);
  }

}
