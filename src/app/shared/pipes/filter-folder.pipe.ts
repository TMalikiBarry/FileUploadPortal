import {Pipe, PipeTransform} from '@angular/core';
import {DossierInterface} from "../../core/models/dossier.interface";

@Pipe({
  name: 'filterFolder'
})
export class FilterFolderPipe implements PipeTransform {

  transform(listFolders: DossierInterface[] | null, search: string): DossierInterface[] {
    return listFolders ? listFolders.filter(dossier => dossier.typeFile.toLowerCase().includes(search.trim().toLowerCase())) : [];
  }

}
