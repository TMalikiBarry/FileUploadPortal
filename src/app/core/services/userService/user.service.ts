import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../../models/ApiResponse";
import {UserInterface} from "../../models/user.interface";
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = environment.API_URL
  private readonly ENDPOINT_USER = "/users/"

  private commercant!: UserInterface
  private userId!: number;

  constructor(private http: HttpClient) {
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log("Infos " + user);
    this.userId = user.id;
  }

  postUser(data: any) {
    console.log(data)
    return this.http.post<ApiResponse>(this.API_URL + "/user/save/", data)
  }

  getUser(id: number) {
    return this.http.get<ApiResponse>(this.API_URL + "/user/" + id);
  }

  saveInLocal(key: string, value: string) {
    localStorage.removeItem(key);
    localStorage.setItem(key, value);
  }

  getLocalValue(key: string): string {
    return localStorage.getItem(key)!;
  }

  getCommercant(): UserInterface {
    this.getUser(this.userId).pipe(
      tap((response) => {
        console.log("Valeur de la request " + response.data);
        this.commercant = <UserInterface>response.data;
        this.saveInLocal('commercant', JSON.stringify(<UserInterface>response.data));
        console.log("Commerçant apres requête réseau " + this.commercant);
      }),
    ).subscribe();

    return this.commercant;
  }

  getMyAgents() {
    if (this.userId) {
      return this.http.get<ApiResponse>(this.API_URL + this.ENDPOINT_USER + this.userId);
    }
    return this.http.get<ApiResponse>(this.API_URL + this.ENDPOINT_USER);
  }

  putUser(data: any, id: number) {
    console.log(data)
    return this.http.put<ApiResponse>(this.API_URL + "/user/edit/" + id, data)
  }

  deleteLogin(id: number) {
    return this.http.delete<ApiResponse>(this.API_URL + "/user/delete/" + id)
  }
}
