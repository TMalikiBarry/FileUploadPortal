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
};

export const H1_LIST_TITLE: { [key in FileType]: string } = {
  'cni_r': 'La liste des cartes d\'identité recto',
  'cni_v': 'La liste des cartes d\'identité verso',
  'geoloc': 'La liste des fiches de géolocalisation du point',
  'honneur': 'La liste des déclarations de l\'honneur',
  'connaissance': 'La liste des fiches de connaissance',
  'CGU': 'La liste des conditions (CGU)',
  'residence': 'La liste des fiches de contrat de location',
  'statut': 'La liste des statuts des entreprises'
}

export const PDF_TEST_URLS = [
  '../../../../assets/pdfTest/CV_Alioune.pdf',
  '../../../../assets/pdfTest/cv_aimerou_ndiaye_ept.pdf',
  '../../../../assets/pdfTest/Evaluation_App_Cloud_Thierno-Maliki-BARRY.pdf',
  '../../../../assets/pdfTest/Conteneur.pdf',
  '../../../../assets/pdfTest/M6L05.pdf',
]
