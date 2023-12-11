import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../services/AuthService/auth.service";
import {NotifService} from "../services/notificationService/notif.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router,
              private notify: NotifService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkUserLogin(route);
  }

  checkUserLogin(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      const userRole = this.authService.getRole();
      if (route.data['roles'] && route.data['roles'].indexOf(userRole) === -1) {
        this.notify.snackMessage('Accès non autorisé', 4000, 'warning');
        this.router.navigateByUrl('');
        return false;
      }
      // let etatDossier = localStorage.getItem('DOSS');
      // console.log('ETAT-DOSSIER ',etatDossier);
      // if (etatDossier) {
      //   if (etatDossier === 'FALSE'){
      //     this.notify.snackMessage("Pas de dossier pour Vous ", 3500, "danger");
      //   } else {
      //     this.notify.snackMessage('Contacter l\'administrateur: Vos documents pas validés!!', 3500
      //       , "danger");
      //   }
      //   this.authService.logout().subscribe();
      //   return false;
      // }
      return true;
    }
    this.router.navigate(['']);
    return false;
  }

}
