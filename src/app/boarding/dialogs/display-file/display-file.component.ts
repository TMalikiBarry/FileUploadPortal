import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Typage, TypageReverse} from "../../../core/models/typage";
import {DESCRIBER_MAP} from "../../../core/models/Constants";

@Component({
  selector: 'app-display-file',
  templateUrl: './display-file.component.html',
  styleUrls: ['./display-file.component.scss']
})
export class DisplayFileComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { fileSrc: string, agentName: string, typeFile: Typage }) {
  }

  ngOnInit(): void {
  }

  getParagraph(typeFile: Typage): string {
    return DESCRIBER_MAP[TypageReverse[typeFile]];
  }
}
