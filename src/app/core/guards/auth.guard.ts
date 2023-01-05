import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../services/AuthService/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    /*const {myToken: token} = this.authService;
    if (token) {
      return true
    } else {
      this.router.navigateByUrl('login');
      return false
    }*/
    return this.checkUserLogin(route, state.url);
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.authService.isLoggedIn()) {
      const userRole = this.authService.getRole();
      //console.log(this.authService.getRole())
      if (route.data['roles'] && route.data['roles'].indexOf(userRole) === -1) {
        console.log(userRole + " != " + route.data['roles'])
        /*this._snackBar.openFromComponent(DialogAlertComponent, {
          data: "Acces non autoriser",
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: "end",
          panelClass: ["custom-style-delete"]
        })*/
        this.router.navigateByUrl('/login');
        return false;
      }
      return true;
    }
    this.router.navigate(['']);
    return false;
  }

}
