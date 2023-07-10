import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment.prod";
import {LoginInterface} from "../../models/login.interface";
import {ApiResponse} from "../../models/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuth: boolean = false;
  roleAs !: string | null;
  role !: string;
  public currentUser$!: Observable<LoginInterface>;
  private currentLoggedIn!: LoginInterface;
  private currentUserSubject!: BehaviorSubject<LoginInterface>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<LoginInterface>(JSON.parse(<string>localStorage.getItem("currentUser")));
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): LoginInterface {
    return this.currentUserSubject.value;
  }
  public login(username: string, password: string) {
    return this.http.post<LoginInterface>(`${environment.API_URL}/login`, {username, password})
      .pipe(tap(user => {
          // login successful if there's a jwt token in the response
          if (user && user.accessToken) {
            this.currentLoggedIn = user;
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('STATE', 'true');
            localStorage.setItem('ROLE', this.getTheRole(user.roles));
            localStorage.setItem('TOKEN', user.accessToken);
            // console.log('USER INFOS', user)
            // this.getMyDossiers(user.id).subscribe({
            //   next : value => {
            //     let dossiers = value.data as DossierInterface[]
            //     if (dossiers.length > 0 && dossiers.some(d => d.statut!== EStatutDossier.VALIDER)){
            //       localStorage.setItem('DOSS','INVALID');
            //       // this.notify.snackMessage('Contacter l\'administrateur: Vos documents pas validés!!', 3500
            //       //   , "danger");
            //       // return;
            //     }else {
            //       localStorage.setItem('DOSS','FALSE');
            //       // this.notify.snackMessage("Pas de dossier pour Vous ", 3500, "danger");
            //       // return;
            //     }
            //   }
            // });
            this.currentUserSubject.next(user);
          }
        }),
        // mergeMap(user => this.getMyDossiers(user.id)),
        // map((res => {
        //   let dossiers = res.data as DossierInterface[]
        //   if (dossiers.length > 0 && dossiers.some(d => d.statut!== EStatutDossier.VALIDER)){
        //     localStorage.setItem('DOSS','INVALID');
        //     // this.notify.snackMessage('Contacter l\'administrateur: Vos documents pas validés!!', 3500
        //     //   , "danger");
        //     // return;
        //   }else {
        //     localStorage.setItem('DOSS','FALSE');
        //     // this.notify.snackMessage("Pas de dossier pour Vous ", 3500, "danger");
        //     // return;
        //   }
        //   return this.currentLoggedIn;
        // }))
      );
  }

  getMyDossiers(myId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.API_URL}/dossier/agentDossiers/${myId}`);
  }

  public authenticateUser(login: LoginInterface): Observable<boolean> {
    this.currentUserSubject.next(login);
    this.isAuth = this.isAuthorized(login.roles);
    return of(this.isAuth);
  }

  public hasRole(roles: string): boolean {
    return this.currentUserSubject.getValue()!.roles.includes(roles);
  }

  public logout(): Observable<boolean> {
    this.isAuth = false;
    this.roleAs = '';
    localStorage.clear();
    localStorage.removeItem('currentUser');
    this.router.navigateByUrl("/login");
    location.reload();
    // mettre à jour la liste des users
    return of(true);
  }

  getRole() {
    this.roleAs = localStorage.getItem('ROLE');
    return this.roleAs;
  }

  isLoggedIn() {
    const loggedIn = localStorage.getItem('STATE');
    this.isAuth = loggedIn == 'true';
    return this.isAuth;
  }

  routingAlreadyConnectedApp() {
    if (localStorage.getItem('currentUser')) {
      let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (user) {
        this.authenticateUser(user);
        this.isAuth = true;
        this.router.navigateByUrl('/dashboard');
      } else {
        this.router.navigateByUrl('');
      }
    }
  }

  isAuthorized(roles: string[]): boolean {
    let bool: boolean = false;
    for (let role of roles) {
      bool = ['COMMERCANT', 'SUPERVISEUR'].includes(role);
      if (bool)
        break;
    }
    return bool;
  }

  public getTheRole(roles: [string]): string {
    if (roles.indexOf("COMMERCANT") !== -1) {
      return this.role = "COMMERCANT"
    } else if (roles.indexOf("SUPERVISEUR") !== -1) {
      return this.role = "SUPERVISEUR";
    }

    return this.role = "";
  }
}
