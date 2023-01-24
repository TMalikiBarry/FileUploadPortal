import {FileType} from "../../boarding/components/config-folder/config-folder.component";

export const PARAGRAPH_MAP: { [key in FileType]: string } = {
  'cni_r': 'Recto de la CNI',
  'cni_v': 'Verso de la CNI',
  'geoloc': 'Géolocalisation du point',
  'honneur': 'Déclaration de l\'honneur',
  'connaissance': 'Fiche de Connaissance',
  'CGU': 'Conditions (CGU)',
  'residence': 'Contrat de location',
  'statut': 'Statut de l\'entreprise'
};

export const DESCRIBER_MAP: { [key in FileType]: string } = {
  'cni_r': 'Carte d\'identité recto de',
  'cni_v': 'Carte d\'identité verso de',
  'geoloc': 'Fiche de géolocalisation du point de',
  'honneur': 'Déclaration de l\'honneur de',
  'connaissance': 'Fiche de connaissance de',
  'CGU': 'Conditions (CGU) de',
  'residence': 'Fiche de contrat de location de',
  'statut': 'Statut de l\'entreprise de'
}
