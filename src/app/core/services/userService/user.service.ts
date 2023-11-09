import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../models/ApiResponse";
import {UserInterface} from "../../models/user.interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = environment.API_URL
  private readonly ENDPOINT_USER = "/users/"

  private commercant!: UserInterface
  private userId!: number;

  constructor(private http: HttpClient) {
    let user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    console.log('USER INFOS', user);
    this.userId = user.id;
  }

  getAgentDossiers(idAgent: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.API_URL}/dossier/agentDossiers/${idAgent}`);
  }

  getUser(id: number) {
    return this.http.get<ApiResponse>(this.API_URL + "/user/" + id);
  }

  saveInLocal(key: string, value: string) {
    // sessionStorage.removeItem(key);
    const currentValue = sessionStorage.getItem(key);
    if (currentValue !== value) {
      sessionStorage.setItem(key, value);
    }
  }

  getLocalValue(key: string): string {
    return sessionStorage.getItem(key)!;
  }

  async getCommercant(): Promise<UserInterface> {
    const response = await this.getUser(this.userId).toPromise();
    this.commercant = <UserInterface>response!.data;
    this.saveInLocal('commercant', JSON.stringify(<UserInterface>response!.data));
    return this.commercant;
  }

  getMyAgents(id : number) {
    // if (this.userId) {
    //   return this.http.get<ApiResponse>(this.API_URL + this.ENDPOINT_USER + this.userId);
    // }
    return this.http.get<ApiResponse>(this.API_URL + this.ENDPOINT_USER + id);
  }
}
