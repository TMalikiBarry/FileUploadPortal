import {Typage} from "../../boarding/components/config-folder/config-folder.component";
import {UserInterface} from "./user.interface";

export interface DossierInterface {
  id?: number;
  name: string,
  uploadingFile: string,
  typeFile: Typage;
  acces: UserInterface
}
