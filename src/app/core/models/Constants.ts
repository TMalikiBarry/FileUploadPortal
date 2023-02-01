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
  'cni_r': 'Carte d\'identité recto',
  'cni_v': 'Carte d\'identité verso',
  'geoloc': 'Fiche de géolocalisation du point',
  'honneur': 'Déclaration sur l\'honneur / ( ou ) Casier judiciaire',
  'connaissance': 'Fiche Connaissance',
  'CGU': 'Conditions (CGU)',
  'residence': 'Fiche de contrat de location',
  'statut': 'Statut de l\'entreprise'
};

export const H1_LIST_TITLE: { [key in FileType]: string } = {
  'cni_r': 'cartes d\'identité recto',
  'cni_v': 'cartes d\'identité verso',
  'geoloc': 'fiches de géolocalisation du point',
  'honneur': 'déclarations sur l\'honneur',
  'connaissance': 'fiches Connaissance',
  'CGU': 'conditions (CGU)',
  'residence': 'fiches de contrat de location',
  'statut': 'statuts des entreprises'
}

export const PDF_TEST_URLS = [
  '../../../../assets/pdfTest/CV_Alioune.pdf',
  '../../../../assets/pdfTest/cv_aimerou_ndiaye_ept.pdf',
  '../../../../assets/pdfTest/Evaluation_App_Cloud_Thierno-Maliki-BARRY.pdf',
  '../../../../assets/pdfTest/Conteneur.pdf',
  '../../../../assets/pdfTest/M6L05.pdf',
]
