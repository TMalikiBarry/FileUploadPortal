import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthService} from "../services/AuthService/auth.service";
import {NotifService} from "../services/notificationService/notif.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private notify: NotifService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {

      if (err.error instanceof ErrorEvent) {
        // Get client-side error
        console.error(`client-side error --- Error Code: ${err.status}\nContent: `);
        console.table(err.error);
      } else {
        // Get server-side error
        console.error(`Backend returned code ${err.status}, body was:`);
        console.table(err.error);
      }

      if ([401, 403].indexOf(err.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        if (this.auth.isAuth) {
          this.auth.logout();
          location.reload();
          this.notify.snackMessage("Connexion expirée", 3500, "warning");
        }
      }
      if ([500].indexOf(err.status) !== -1) {
        this.notify.snackMessage("Erreur SERVEUR", 5000, "danger");
      }
      if ([404].indexOf(err.status) !== -1) {
        this.notify.snackMessage("Introuvable", 5000, "danger");
      }
      if ([400].indexOf(err.status) !== -1) {
        this.notify.snackMessage("Une erreur est survenue", 5000, "danger");
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}
