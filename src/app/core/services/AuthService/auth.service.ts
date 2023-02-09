import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment.prod";
import {LoginInterface} from "../../models/login.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuth: boolean = false;
  roleAs !: string | null;
  role !: string;
  public currentUser!: Observable<LoginInterface>;
  private token!: string;
  private currentUserSubject!: BehaviorSubject<LoginInterface>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<LoginInterface>(JSON.parse(<string>localStorage.getItem("currentUser")));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): LoginInterface {
    return this.currentUserSubject.value;
  }

  get myToken(): string {
    return this.token;
  }

  public login(username: string, password: string) {
    return this.http.post<LoginInterface>(`${environment.API_URL}/login`, {username, password})
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.accessToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('STATE', 'true');
          localStorage.setItem('ROLE', this.getTheRole(user.roles));
          localStorage.setItem('TOKEN', user.accessToken)
          this.isAuth = true;
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  public authenticateUser(login: LoginInterface): Observable<boolean> {
    this.currentUserSubject.next(login);
    this.isAuth = true;
    return of(true);
  }

  public hasRole(roles: string): boolean {
    return this.currentUserSubject.getValue()!.roles.includes(roles);
  }

  public logout(): Observable<boolean> {
    this.isAuth = false;
    this.roleAs = '';
    /*localStorage.removeItem("currentUser");
    localStorage.setItem('STATE', 'false');
    localStorage.setItem('ROLE', '');
    localStorage.setItem('TOKEN', '')*/
    localStorage.clear();
    // mettre à jour la liste des users
    return of(true);
  }

  /*
    testChargerFichier() {
      let headers = new HttpHeaders();
      // headers = headers.set('Accept', 'application/pdf');

      return this.http.get(`${environment.API_URL}/dossier/getFile/25-01-2023_13-17-33_CNI_RECTO_M5L4-collections-part1.pdf`
        , {
          // headers,
          observe: 'response',
          responseType: 'blob'
        })
        /!*.pipe(
          map(res => {
            const contentDisposition = res.headers.get('content-disposition');
            console.log(contentDisposition);
            const fileName = contentDisposition!.split(';')[1].split('=')[1];
            return {
              fileName: fileName.replace(/"/g, ''),
              data: res.body
            };
          })
        );*!/
    }
  */

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

  public getTheRole(roles: [string]): string {
    if (roles.indexOf("ADMIN") !== -1) {
      return this.role = "ADMIN"
    } else if (roles.indexOf("COMMERCANT") !== -1) {
      return this.role = "COMMERCANT"
    } else if (roles.indexOf("AGENT") !== -1) {
      return this.role = "AGENT";
    }

    return this.role = "";
  }

  loginByOldWay() {
    this.token = "My fake Token";
  }
}
