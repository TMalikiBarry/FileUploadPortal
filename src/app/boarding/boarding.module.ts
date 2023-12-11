import {NgModule} from '@angular/core';

import {BoardingRoutingModule} from './boarding-routing.module';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {SharedModule} from "../shared/shared.module";
import {ListAgentsComponent} from './components/list-agents/list-agents.component';
import {ConfigFolderComponent} from './components/config-folder/config-folder.component';
import {ViewFoldersComponent} from './components/view-folders/view-folders.component';
import {MyProfileComponent} from './components/my-profile/my-profile.component';
import {ViewOneFolderComponent} from './components/view-one-folder/view-one-folder.component';
import {SaveDossierComponent} from './dialogs/save-dossier/save-dossier.component';
import {DisplayFileComponent} from './dialogs/display-file/display-file.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ListAgentsComponent,
    ConfigFolderComponent,
    ViewFoldersComponent,
    MyProfileComponent,
    ViewOneFolderComponent,
    SaveDossierComponent,
    DisplayFileComponent,
  ],
  imports: [
    BoardingRoutingModule,
    SharedModule,
  ],
  providers: []
})
export class BoardingModule {
}
