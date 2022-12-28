import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from "./material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule
  ]
})
export class SharedModule {
}
