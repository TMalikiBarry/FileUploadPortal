import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-save-dossier',
  templateUrl: './save-dossier.component.html',
  styleUrls: ['./save-dossier.component.scss']
})
export class SaveDossierComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { agentName: string }) {
  }

  ngOnInit(): void {
  }

}
