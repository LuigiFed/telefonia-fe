import type { Assegnatario, Device, DeviceManagement, DeviceModel, DeviceStatus, DeviceType, MobileProvider, Reference, ServiceType } from "../../types/types";

export const devices: DeviceModel[] = [
  { id: 1, desModello: "Router AC1200" },
  { id: 2, desModello: "Switch 24 porte" },
  { id: 3, desModello: "Modem VDSL2" },
  { id: 4, desModello: "Modem VDSL1" },
  { id: 5, desModello: "Modem ADSL" },
  { id: 6, desModello: "Modem ADSL2" },
  { id: 7, desModello: "Modem ADSL3" },
  { id: 8, desModello: "Modem ADSL4" },
];

export const deviceTypes: DeviceType[] = [
  { id: 1, codice: "1", descrizione: "Smartphone" },
  { id: 2, codice: "2", descrizione: "Tablet" },
  { id: 3, codice: "3", descrizione: "PC" },
  { id: 4, codice: "4", descrizione: "Laptop" },
  { id: 5, codice: "5", descrizione: "Monitor" },
  { id: 6, codice: "6", descrizione: "Router" },
  { id: 7, codice: "7", descrizione: "Switch" },
  { id: 8, codice: "8", descrizione: "Modem" },
  { id: 9, codice: "9", descrizione: "Scanner" }  

];

export const mobileProviders: MobileProvider[] = [
  { id: 1, codice: "1", descrizione: "TIM" },
  { id: 2, codice: "2", descrizione: "Vodafone" },
  { id: 3, codice: "3", descrizione: "WindTre" },
  { id: 4, codice: "4", descrizione: "Iliad" },
  { id: 5, codice: "5", descrizione: "Fastweb" },
  { id: 6, codice: "6", descrizione: "Movistar" },

];

export const deviceStatuses: DeviceStatus[] = [
  { id: 1, codice: "1", descrizione: "Assegnato", alias: "AS" },
  { id: 2, codice: "2", descrizione: "Riconsegnato", alias: "RI" },
  { id: 3, codice: "3", descrizione: "Smarrito/Rubato", alias: "SR" },
  { id: 4, codice: "4", descrizione: "In Riparazione", alias: "IR" },
  { id: 5, codice: "5", descrizione: "Fuori Uso", alias: "FU" },
  { id: 6, codice: "6", descrizione: "Sostituzione", alias: "SO" },
  { id: 7, codice: "7", descrizione: "Portabilità > Utenza Personale", alias: "PUP" },
  { id: 8, codice: "8", descrizione: "Portabilità > Altra Amministrazione", alias: "PAM" },
  { id: 9, codice: "9", descrizione: "Cessato (riconsegnato al fornitore)", alias: "CRF" },
];

export const assegnatari: Assegnatario[] = [
  {
    id: 1,
    nome: "Mario",
    cognome: "Rossi",
    tipoUtente: "Dipendente",
    unitaOrganizzativa: "IT - Sistemi Informativi",
    note: "Responsabile tecnico",
  },
  {
    id: 2,
    nome: "Luca",
    cognome: "Bianchi",
    tipoUtente: "Consulente",
    unitaOrganizzativa: "Ufficio Acquisti",
    note: "Supporto temporaneo",
  },
];

export const assegnazioni: Device[] = [
  {
    id: 1,
    asset: "ASSET-1001",
    tipo: "Smartphone",
    utenza: "TIM 3451234567",
    imei: "352099101234567",
    seriale: "SN001",
    modello: "iPhone 14",
    stato: "AS",
    dataInizio: "2024-03-15",
    dataFine: "",
    note: "Telefono principale",
    utenteId: 1,
  },
  {
    id: 2,
    asset: "ASSET-2001",
    tipo: "Tablet",
    utenza: "Vodafone 3497654321",
    imei: "353511102345678",
    seriale: "SN002",
    modello: "iPad Air",
    stato: "RI",
    dataInizio: "2023-11-10",
    dataFine: "2024-05-22",
    note: "Riconsegnato per cambio modello",
    utenteId: 2,
  },
];

export const deviceManagement: DeviceManagement[] = [
  {
    id: 1,
    asset: "ASSET-3001",
    email: "mario.rossi@example.com",
    tipo: "Smartphone",
    modello: "iPhone 14",
    numeroTelefono: "3451234567",
    sede: "Milano",
    idInventario: "INV-001",
    fornitore: "Apple",
    gestore: "TIM",
    note: "Telefono principale",
    inizio: "2024-03-15",
    servizio: "Fonia e dati",
  },
  {
    id: 2,
    asset: "ASSET-4001",
    email: "luca.bianchi@example.com",
    tipo: "Tablet",
    modello: "iPad Air",
    numeroTelefono: "3497654321",
    sede: "Roma",
    idInventario: "INV-002",
    fornitore: "Samsung",
    gestore: "Vodafone",
    note: "Riconsegnato per cambio modello",
    inizio: "2023-11-10",
    servizio: "Fonia e dati",
  },
  {
    id: 3,
    asset: "ASSET-5001",
    email: "giuseppe.verdi@example.com",
    tipo: "Smartphone",
    modello: "iPhone 14",
    numeroTelefono: "3451234567",
    sede: "Milano",
    idInventario: "INV-003",
    fornitore: "Apple",
    gestore: "TIM",
    note: "Telefono principale",
    inizio: "2024-03-15",
    servizio: "Fonia e dati",
  },
  {
    id: 4,
    asset: "ASSET-6001",
    email: "giuseppe.verdi@example.com",
    tipo: "Smartphone",
    modello: "iPhone 14",
    numeroTelefono: "3451234567",
    sede: "Milano",
    idInventario: "INV-004",
    fornitore: "Apple",
    gestore: "TIM",
    note: "Telefono principale",
    inizio: "2024-03-15",
    servizio: "Fonia e dati",
  },
];

export const reference: Reference[] = [
  { id: 1, descrizione: "iPhone 14" },
  { id: 2, descrizione: "iPad Air" },
  { id: 3, descrizione: "Galaxy S23" },
];

export const serviceType: ServiceType[] = [
  { id: 1, descrizione: "Fonia e dati" },
  { id: 2, descrizione: "Accesso Internet" },
  { id: 3, descrizione: "Accesso WiFi" },
];
