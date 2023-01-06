import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from "./material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {FormatNamePipe} from './pipes/format-name.pipe';

@NgModule({
  declarations: [
    FormatNamePipe,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FormatNamePipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule
  ]
})
export class SharedModule {
}
