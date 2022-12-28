import {NgModule} from '@angular/core';

import {BoardingRoutingModule} from './boarding-routing.module';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    BoardingRoutingModule,
    SharedModule
  ]
})
export class BoardingModule {
}
