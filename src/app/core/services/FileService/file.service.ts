import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {DossierInterface} from "../../models/dossier.interface";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  tableauCNI: string[] = ['\'image/jpeg\'', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'];
  tableau: string[] = [...this.tableauCNI, 'doc', 'docx', 'odt', 'rft', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
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

  checkTypeFile(extension: string, typeFile: 'CNI' | 'notCNI'): boolean {
    return typeFile === 'CNI' ? this.tableauCNI.indexOf(extension.toLowerCase().split('.').pop()!) !== -1 :
      this.tableau.indexOf(extension.toLowerCase().split('.').pop()!) !== -1;
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  saveDossier(fileInfos: DossierInterface) {
    return this.http.post(`${this.baseUrl}/new`, fileInfos);
  }

  saveAllDossier(fileInfos: DossierInterface[]) {
    return this.http.post(`${this.baseUrl}/newfiles`, fileInfos);
  }

  uploadFile(file: File, type: string) {
    let formData: FormData = new FormData();
    formData.append("file", file);
    return this.http.post(this.baseUrl + "/upload/" + type, formData);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

}
