import {UserInterface} from "./user.interface";
import {Typage} from "./typage";
import {PointInterface} from "./point.interface";

export interface DossierInterface {
  id?: number;
  name: string,
  uploadingFile: string,
  typeFile: Typage;
  acces: UserInterface;
  geolocalisation: PointInterface
}
