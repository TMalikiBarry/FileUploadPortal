import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./core/guards/auth.guard";
import {DashboardComponent} from "./boarding/components/dashboard/dashboard.component";

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {
    path: 'dashboard',
    component: DashboardComponent,
    loadChildren: () => import('./boarding/boarding.module').then(m => m.BoardingModule),
    canActivate: [AuthGuard]
  },
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
