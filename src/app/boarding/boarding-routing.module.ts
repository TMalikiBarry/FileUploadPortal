import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Role} from "./components/dashboard/dashboard.component";
import {AuthGuard} from "../core/guards/auth.guard";
import {ListAgentsComponent} from "./components/list-agents/list-agents.component";
import {ConfigFolderComponent} from "./components/config-folder/config-folder.component";
import {ViewFoldersComponent} from "./components/view-folders/view-folders.component";
import {MyProfileComponent} from "./components/my-profile/my-profile.component";
import {ViewOneFolderComponent} from "./components/view-one-folder/view-one-folder.component";

const routes: Routes = [
  {
    path: 'mes-agents',
    component: ListAgentsComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN, Role.COMMERCANT]}
  },
  {
    path: 'mes-agents/:id',
    component: ConfigFolderComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN, Role.COMMERCANT]}
  },
  {
    path: 'voir-dossiers',
    component: ViewFoldersComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN, Role.COMMERCANT]}
  },
  {
    path: 'voir-dossier/:type',
    component: ViewOneFolderComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN, Role.COMMERCANT]}
  },
  {
    path: 'mon-profil',
    component: MyProfileComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.ADMIN, Role.COMMERCANT]}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardingRoutingModule {
}
