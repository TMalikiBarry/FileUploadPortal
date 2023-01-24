import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from "./material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {FormatNamePipe} from './pipes/format-name.pipe';
import {FormatFileSizePipe} from './pipes/format-file-size.pipe';
import {PdfViewerModule} from "ng2-pdf-viewer";

@NgModule({
  declarations: [
    FormatNamePipe,
    FormatFileSizePipe,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    PdfViewerModule,
    ReactiveFormsModule,
    FormatNamePipe,
    FormatFileSizePipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule
  ]
})
export class SharedModule {
}
