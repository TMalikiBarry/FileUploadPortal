import {UserInterface} from "./user.interface";
import {Typage} from "./typage";

export interface DossierInterface {
  id?: number;
  name: string,
  uploadingFile: string,
  typeFile: Typage;
  acces: UserInterface;
  statut: EStatutDossier;
}

export enum EStatutDossier {
  INITIER = "INITIER",
  VALIDER = "VALIDER",
  REJETER = "REJETER"
}
