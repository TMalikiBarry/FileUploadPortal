import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {DossierInterface} from "../../models/dossier.interface";
import {ApiResponse} from "../../models/ApiResponse";
import {Observable} from "rxjs";
import {Typage} from "../../models/typage";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  limitSelfie = 6 * 1024 * 1024;
  limitFile = 3 * 1024 * 1024;
  private baseUrl = environment.API_URL + "/dossier";

  constructor(private http: HttpClient) {
  }

  isTypeFilePDF(file: File) {
    return file.name.toLowerCase().split('.').pop() === 'pdf';
  }

  checkSize(file: File, fileType: "selfieIdentity" | "notSelfie" = 'selfieIdentity'): boolean {
    if (fileType === 'selfieIdentity') {
      return file.size <= this.limitSelfie;
    } else if (fileType === 'notSelfie') {
      return file.size <= this.limitFile;
    } else {
      throw new Error('Le type de fichier spécifié n\'est pas pris en compte');
    }
  }

  saveAllDossier(fileInfos: DossierInterface[]) {
    return this.http.post(`${this.baseUrl}/newfiles`, fileInfos);
  }

  removeFile(fileName: string) {
    return this.http.delete(`${this.baseUrl}/deleteFile/${fileName}`);
  }

  uploadFile(file: File, type: string) {
    let formData: FormData = new FormData();
    formData.append("file", file);
    return this.http.post(this.baseUrl + "/upload/" + type, formData);
  }

  getAgentDossiers(idAgent: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/agentDossiers/${idAgent}`);
  }

  getAllDossiersAgentsByType(idCommercant: number, type: Typage): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/commercantDossiers/${idCommercant}/${type}`);
  }

  deleteAgentDossiers(idAgent: number) {
    return this.http.delete(`${this.baseUrl}/deleteAgentDossiers/${idAgent}`);
  }
}
